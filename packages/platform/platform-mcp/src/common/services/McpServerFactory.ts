import {constant, inject, injectable, injector, type TokenProvider} from "@tsed/di";
import type {PlatformMcpSettings, PromptsSettings, ResourceSettings, ToolProps} from "../index.js";
import {MCP_PROVIDER_TYPES} from "../index.js";
import {McpServer, type ResourceTemplate} from "@modelcontextprotocol/server";

function collectTokens(type: string, configured: TokenProvider[] = []): TokenProvider[] {
  const tokens = new Set<TokenProvider>(configured);

  injector()
    .providers.getMany(type)
    .forEach((provider) => tokens.add(provider.token));

  return [...tokens];
}

export function createMcpServer() {
  const settings = constant<PlatformMcpSettings>("mcp", {}) || {};
  const name = settings.name || constant<string>("name") || "tsed-mcp";
  const version = settings.version || constant<string>("version") || "0.0.0";
  const {websiteUrl, description, title, icons} = settings;

  const server = new McpServer(
    {
      websiteUrl,
      description,
      icons,
      title,
      name,
      version
    },
    settings?.serverOptions
  );

  const toolTokens = collectTokens(MCP_PROVIDER_TYPES.TOOL, settings.tools);
  toolTokens.forEach((token) => {
    const definition = inject<ToolProps<any, any> & {handler: any}>(token);
    const {name, handler, ...opts} = definition;
    server.registerTool(name!, opts as any, handler as any);
  });

  const resourceTokens = collectTokens(MCP_PROVIDER_TYPES.RESOURCE, settings.resources);
  resourceTokens.forEach((token) => {
    const definition = inject<ResourceSettings & {uri?: string; template?: ResourceTemplate}>(token);
    const {name, handler, uri, template, ...opts} = definition;
    const resourceName = name || String(token);

    if (uri) {
      server.registerResource(resourceName, uri, opts, handler as any);
    } else {
      server.registerResource(resourceName, template as ResourceTemplate, opts, handler as any);
    }
  });

  const promptTokens = collectTokens(MCP_PROVIDER_TYPES.PROMPT, settings.prompts);
  promptTokens.forEach((token) => {
    const definition = inject<PromptsSettings>(token);
    const {name, handler, ...opts} = definition;
    server.registerPrompt(name || String(token), opts as any, handler as any);
  });

  return server;
}

/**
 * Injectable MCP server instance configured with registered tools, resources, and prompts.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export const MCP_SERVER = injectable(McpServer).factory(createMcpServer).token();

/**
 * Type alias referencing the MCP server provider token.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type MCP_SERVER = typeof MCP_SERVER;
