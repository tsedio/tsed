import type {ResourceTemplate} from "@modelcontextprotocol/sdk/server/mcp.js";
import {classOf} from "@tsed/core";
import {isString} from "@tsed/core/utils/isString.js";

import {defineResource, type ResourceProps} from "../fn/defineResource.js";

/**
 * Options accepted by the {@link Resource} decorator beyond the handler binding fields, allowing callers to override metadata.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type ResourceDecoratorOptions = Omit<ResourceProps, "handler" | "uri" | "template">;

/**
 * Decorator that turns a class method into an MCP resource backed by either a URI or a full {@link ResourceTemplate}.
 *
 * @param uriOrTemplate Direct URI string or a template describing the resource discovery metadata.
 * @param options Optional overrides for metadata such as name, description, or visibility.
 * @module platform/mcp
 * @since 8.17.0
 *
 * ### Usage
 * ```ts
 * class FileCatalog {
 *   @Resource("file:///var/data/catalog")
 *   async readCatalog() {
 *     return {contents: [{uri: "file:///var/data/catalog/index.json"}]};
 *   }
 * }
 * ```
 */
export function Resource(uriOrTemplate: string | ResourceTemplate, options?: Partial<ResourceDecoratorOptions>) {
  return (target: any, propertyKey: string | symbol, _: PropertyDescriptor) => {
    defineResource({
      ...(options as ResourceProps),
      name: options?.name || String(propertyKey),
      token: classOf(target),
      propertyKey,
      uri: isString(uriOrTemplate) ? uriOrTemplate : undefined,
      template: !isString(uriOrTemplate) ? uriOrTemplate : undefined
    } as any);
  };
}
