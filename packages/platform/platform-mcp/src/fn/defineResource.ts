import type {ReadResourceCallback, ResourceMetadata, ResourceTemplate} from "@modelcontextprotocol/sdk/server/mcp.js";
import {context, inject, injectable, logger, type TokenProvider} from "@tsed/di";
import {JsonEntityStore} from "@tsed/schema";
import {constantCase} from "change-case";

import {MCP_PROVIDER_TYPES} from "../constants/constants.js";

type ResourceMetadataProps = ResourceMetadata & {
  name: string;
};

export type FnResourceReadProps = ResourceMetadataProps & {
  uri: string;
  handler: ReadResourceCallback;
};

export type FnResourceTemplateProps = ResourceMetadataProps & {
  template: ResourceTemplate;
  handler: ReadResourceCallback;
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
  let handler: ReadResourceCallback;
  const name = options.name || ("propertyKey" in options ? String(options.propertyKey) : undefined);

  if (isClassResourceProps(options)) {
    const {token, propertyKey} = options;

    handler = (...args: any[]) => {
      const instance = inject(options.token) as any;
      return instance[propertyKey](...args);
    };

    const methodStore = JsonEntityStore.fromMethod(token, propertyKey);
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
            return await handler(...args);
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
              request_id: context().id,
              resource: opts.name
            });

            return {
              contents: [],
              _meta: {
                status_code: safeErr.status,
                code,
                error_name: safeErr.name,
                message: safeErr.message,
                request_id: context().id,
                resource: opts.name
              }
            };
          }
        }
      };
    });

  return provider.token();
}
