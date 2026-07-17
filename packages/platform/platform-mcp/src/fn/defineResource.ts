import type {ReadResourceCallback, ResourceMetadata, ResourceTemplate} from "@modelcontextprotocol/sdk/server/mcp.js";
import type {ReadResourceResult} from "@modelcontextprotocol/sdk/types.js";
import {context, inject, injectable, logger, type TokenProvider} from "@tsed/di";
import {MCP_PROVIDER_TYPES} from "../constants/constants.js";
import {constantCase} from "change-case";
import {s} from "@tsed/schema";
import {asResourceResponse} from "../utils/asResourceResponse.js";

type ResourceMetadataProps = ResourceMetadata & {
  name: string;
};

export type ResourceCallback = (
  ...args: Parameters<ReadResourceCallback>
) => ReadResourceResult | Record<string, unknown> | Promise<ReadResourceResult | Record<string, unknown>>;

export type FnResourceReadProps = ResourceMetadataProps & {
  uri: string;
  handler: ResourceCallback;
};

export type FnResourceTemplateProps = ResourceMetadataProps & {
  template: ResourceTemplate;
  handler: ResourceCallback;
};

type ClassResourceBaseProps = Omit<ResourceMetadataProps, "name"> & {
  name?: string;
  token: TokenProvider;
  propertyKey: string | symbol;
};

export type ClassResourceReadProps = ClassResourceBaseProps & {
  uri: string;
};

export type ClassResourceTemplateProps = ClassResourceBaseProps & {
  template: ResourceTemplate;
};

/**
 * Configuration accepted by {@link defineResource}, supporting either URI-based or template-based resources.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type ResourceProps = FnResourceReadProps | FnResourceTemplateProps | ClassResourceReadProps | ClassResourceTemplateProps;

function isClassResourceProps(options: ResourceProps): options is ClassResourceReadProps | ClassResourceTemplateProps {
  return "token" in options && "propertyKey" in options;
}

function mapOptions(options: ResourceProps) {
  let handler: ResourceCallback;
  const name = options.name || ("propertyKey" in options ? String(options.propertyKey) : undefined);

  if (isClassResourceProps(options)) {
    const {token, propertyKey} = options;

    handler = (...args: any[]) => {
      const instance = inject(options.token) as any;
      return instance[propertyKey](...args);
    };

    const methodStore = s.store.method(token, propertyKey);
    options.description = options.description || methodStore.operation.get("description");
    options.title = options.title || methodStore.schema.get("title");
  } else {
    handler = options.handler;
  }

  return {
    ...options,
    name,
    handler
  };
}

export type ResourceSettings = ReturnType<typeof mapOptions>;

/**
 * Registers an MCP resource provider with the Ts.ED injector and returns its token.
 *
 * @param options Resource metadata describing either a static URI or a template builder.
 * @returns The DI token referencing the registered resource provider.
 * @module platform/mcp
 * @since 8.17.0
 *
 * ### Usage
 * ```ts
 * defineResource({
 *   name: "docs",
 *   uri: "file:///var/data/docs",
 *   handler: async () => ({contents: [{uri: "file:///var/data/docs/readme.md"}]})
 * });
 * ```
 */
export function defineResource(options: FnResourceReadProps): TokenProvider;
export function defineResource(options: FnResourceTemplateProps): TokenProvider;
export function defineResource(options: ClassResourceReadProps): TokenProvider;
export function defineResource(options: ClassResourceTemplateProps): TokenProvider;
export function defineResource(options: ResourceProps): TokenProvider {
  const provider = injectable(Symbol.for(`MCP:RESOURCE:${options.name}`))
    .type(MCP_PROVIDER_TYPES.RESOURCE)
    .factory(() => {
      const {handler, ...opts} = mapOptions(options);

      return {
        ...opts,
        async handler(...args: Parameters<ReadResourceCallback>) {
          try {
            const result = await handler(...args);

            logger().info({
              event: "MCP_TOOL_END",
              tool: opts.name
            });

            return asResourceResponse(args[0]?.toString(), result);
          } catch (er: any) {
            const safeErr =
              er && typeof er === "object"
                ? er
                : {
                    message: String(er),
                    name: undefined,
                    status: undefined
                  };
            const code = safeErr.name && safeErr.status ? `E_MCP_RESOURCE_${constantCase(safeErr.name)}` : "E_MCP_RESOURCE_ERROR";

            logger().error({
              event: "MCP_RESOURCE_ERROR",
              status_code: safeErr.status,
              code,
              error_name: safeErr.name,
              message: safeErr.message,
              resource: opts.name
            });

            return asResourceResponse(
              args[0]?.toString(),
              {
                status_code: safeErr.status,
                code,
                error_name: safeErr.name,
                message: safeErr.message,
                request_id: context().id,
                resource: opts.name
              },
              {isError: true}
            );
          } finally {
          }
        }
      };
    });

  return provider.token();
}
