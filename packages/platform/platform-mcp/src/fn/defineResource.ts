import type {ReadResourceCallback, ResourceMetadata, ResourceTemplate} from "@modelcontextprotocol/sdk/server/mcp.js";
import {inject, injectable, type TokenProvider} from "@tsed/di";
import {JsonEntityStore} from "@tsed/schema";

import {MCP_PROVIDER_TYPES} from "../constants/constants.js";

type ResourceBaseProps = ResourceMetadata & {
  name: string;
  handler: ReadResourceCallback;
  token?: TokenProvider;
  propertyKey?: string | symbol;
};

type ResourceReadProps = ResourceBaseProps & {
  uri: string;
};

type ResourceTemplateProps = ResourceBaseProps & {
  template: ResourceTemplate;
};

/**
 * Configuration accepted by {@link defineResource}, supporting either URI-based or template-based resources.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type ResourceProps = ResourceReadProps | ResourceTemplateProps;

function mapOptions(options: ResourceProps) {
  let handler: ReadResourceCallback;

  if ("propertyKey" in options && options.propertyKey) {
    const {token, propertyKey} = options;

    handler = (...args: any[]) => {
      const instance = inject(options.token) as any;
      return instance[propertyKey](...args);
    };

    const methodStore = JsonEntityStore.fromMethod(token, propertyKey);
    options.description = options.description || methodStore.operation.get("description");
    options.title = options.title || methodStore.schema.get("title");
  } else {
    handler = options.handler!;
  }

  return {
    ...options,
    handler
  };
}

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
export function defineResource(options: ResourceReadProps): TokenProvider;
export function defineResource(options: ResourceTemplateProps): TokenProvider;
export function defineResource(options: ResourceProps): TokenProvider {
  const provider = injectable(Symbol.for(`MCP:RESOURCE:${options.name}`))
    .type(MCP_PROVIDER_TYPES.RESOURCE)
    .factory(() => {
      return mapOptions(options);
    });

  return provider.token();
}
