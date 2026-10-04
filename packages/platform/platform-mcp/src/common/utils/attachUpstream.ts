import {type AuthInfo, fromJsonSchema, type McpServer, ResourceTemplate, type ServerContext} from "@modelcontextprotocol/server";
import {inject, logger} from "@tsed/di";
import type {McpUpstreamFilter, McpUpstreamSettings} from "../interfaces/McpUpstreamSettings.js";
import type {CreateMcpServerOpts} from "./createMcpServer.js";
import {
  PlatformMcpGatewayService,
  type PlatformMcpUpstreamCatalog,
  type PlatformMcpUpstreamConnection
} from "../services/PlatformMcpGatewayService.js";
import {resolveUpstream} from "./resolveUpstream.js";

// upstream catalogs are stable objects: compile each schema once instead of on every request
const schemas = new WeakMap<object, ReturnType<typeof fromJsonSchema>>();

function toSchema(key: object, schema: unknown = key) {
  let compiled = schemas.get(key);

  if (!compiled) {
    compiled = fromJsonSchema(schema as never);
    schemas.set(key, compiled);
  }

  return compiled;
}

type Kind = "tool" | "prompt" | "resource" | "resource template";

function isAllowed(filter: McpUpstreamFilter | undefined, value: string) {
  const match = (pattern: string | RegExp) => (typeof pattern === "string" ? pattern === value : pattern.test(value));

  if (filter?.exclude?.some(match)) {
    return false;
  }

  return !filter?.include || filter.include.some(match);
}

function getRequestOptions(ctx: ServerContext) {
  const progressToken = ctx.mcpReq._meta?.progressToken;

  return {
    signal: ctx.mcpReq.signal,
    ...(progressToken !== undefined && {
      onprogress: (progress: Record<string, unknown>) =>
        ctx.mcpReq.notify({method: "notifications/progress", params: {...progress, progressToken}} as never)
    })
  };
}

function getPromptArgsSchema(args: {name: string; description?: string; required?: boolean}[] | undefined) {
  if (!args?.length) {
    return undefined;
  }

  return toSchema(args, {
    type: "object",
    properties: Object.fromEntries(args.map(({name, description}) => [name, {type: "string", ...(description && {description})}])),
    required: args.filter(({required}) => required).map(({name}) => name)
  });
}

function registerCatalog(
  server: McpServer,
  upstream: McpUpstreamSettings,
  label: string,
  {client, run}: PlatformMcpUpstreamConnection,
  catalog: PlatformMcpUpstreamCatalog,
  taken: Record<Kind, Set<string>>
) {
  const {prefix = ""} = upstream;

  const register = (kind: Kind, key: string, fn: () => void) => {
    if (taken[kind].has(key)) {
      logger().warn({
        event: "MCP_GATEWAY_COLLISION",
        message: `MCP upstream "${label}": ${kind} "${key}" is already registered and is skipped.`
      });

      return;
    }

    try {
      fn();
      taken[kind].add(key);
    } catch (error) {
      logger().warn({
        event: "MCP_GATEWAY_REGISTER_ERROR",
        message: `MCP upstream "${label}": unable to register ${kind} "${key}".`,
        error
      });
    }
  };

  catalog.tools
    .filter(({name}) => isAllowed(upstream.tools, name))
    .forEach(({name, inputSchema, outputSchema, ...opts}) => {
      register("tool", prefix + name, () => {
        server.registerTool(
          prefix + name,
          {
            ...opts,
            inputSchema: toSchema(inputSchema),
            ...(outputSchema && {outputSchema: toSchema(outputSchema)})
          } as never,
          ((args: Record<string, unknown>, ctx: ServerContext) =>
            run(() => client.callTool({name, arguments: args}, getRequestOptions(ctx)))) as never
        );
      });
    });

  catalog.resources
    .filter(({uri}) => isAllowed(upstream.resources, uri))
    .forEach(({name, uri, ...opts}) => {
      register("resource", uri, () => {
        server.registerResource(
          name,
          uri,
          opts as never,
          ((_: URL, ctx: ServerContext) => run(() => client.readResource({uri}, getRequestOptions(ctx)))) as never
        );
      });
    });

  catalog.resourceTemplates
    .filter(({uriTemplate}) => isAllowed(upstream.resources, uriTemplate))
    .forEach(({name, uriTemplate, ...opts}) => {
      register("resource template", name, () => {
        server.registerResource(
          name,
          new ResourceTemplate(uriTemplate, {list: undefined}),
          opts as never,
          ((uri: URL, _: unknown, ctx: ServerContext) =>
            run(() => client.readResource({uri: uri.toString()}, getRequestOptions(ctx)))) as never
        );
      });
    });

  catalog.prompts
    .filter(({name}) => isAllowed(upstream.prompts, name))
    .forEach(({name, arguments: args, ...opts}) => {
      register("prompt", prefix + name, () => {
        const argsSchema = getPromptArgsSchema(args);

        server.registerPrompt(
          prefix + name,
          {...opts, ...(argsSchema && {argsSchema})} as never,
          ((...params: unknown[]) => {
            const ctx = params.at(-1) as ServerContext;

            return run(() =>
              client.getPrompt(
                {name, arguments: params.length > 1 ? (params[0] as Record<string, string>) : undefined},
                getRequestOptions(ctx)
              )
            );
          }) as never
        );
      });
    });
}

/**
 * Registers the tools, resources and prompts of the endpoint's upstream MCP server on the given server.
 *
 * Local declarations take precedence over upstream entries. An unreachable upstream is logged and
 * skipped so the endpoint keeps serving its local declarations.
 *
 * @param server Server already holding the local declarations.
 * @param settings Resolved settings of the MCP endpoint.
 * @param authInfo Verified identity of the caller, used to interpolate the upstream placeholders.
 * @module platform/mcp
 */
export async function attachUpstream(server: McpServer, settings: CreateMcpServerOpts, authInfo?: AuthInfo) {
  const {upstream} = settings;

  if (!upstream) {
    return;
  }

  const label = settings.path || (upstream.type === "stdio" ? upstream.command : upstream.url);

  try {
    const connection = await inject(PlatformMcpGatewayService).getConnection(upstream, resolveUpstream(upstream, authInfo));

    registerCatalog(server, upstream, label, connection, await connection.getCatalog(), {
      tool: new Set(settings.tools.map(({name}) => name)),
      prompt: new Set(settings.prompts.map(({name}) => name)),
      resource: new Set(settings.resources.map(({uri}) => uri!).filter(Boolean)),
      "resource template": new Set(settings.resources.filter(({uri}) => !uri).map(({name}) => name))
    });
  } catch (error) {
    logger().error({
      event: "MCP_GATEWAY_UPSTREAM_ERROR",
      message: `MCP upstream "${label}" is unavailable.`,
      error
    });
  }
}
