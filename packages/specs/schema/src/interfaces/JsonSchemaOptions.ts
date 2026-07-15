import type {GenericsMap} from "../domain/Generics.js";
import {SpecTypes} from "../domain/SpecTypes.js";

/**
 * Configuration options for JSON schema generation.
 *
 * These options control how JSON schemas are generated from TypeScript classes,
 * including alias mapping, component references, spec type selection, group filtering,
 * and custom key generation. The options affect both JSON Schema and OpenAPI
 * specification generation.
 *
 * ### Usage
 *
 * ```typescript
 * import {compile, JsonSchemaOptions} from "@tsed/schema";
 *
 * const options: JsonSchemaOptions = {
 *   specType: SpecTypes.OPENAPI,
 *   specVersion: "3.0.3",
 *   groups: ["public"],
 *   useAlias: true,
 *   customKeys: true
 * };
 *
 * const schema = compile(MyModel, options);
 * ```
 *
 * @public
 */
export interface JsonSchemaOptions {
  /**
   * Map properties with the alias name. By default, false
   */
  useAlias?: boolean;
  /**
   * Reference to components Object.
   */
  components?: Record<string, any>;
  /**
   * Define Spec types level
   */
  specType?: SpecTypes;
  /**
   * Define the spec version for OPENAPI (3.1.0, 3.0.3, 3.0.2, 3.0.1, 3.0.0)
   */
  specVersion?: string;
  /**
   * Define a group restriction to generate the JsonSchema.
   * Set false to disable groups.
   */
  groups?: string[] | false;
  /**
   * Set the postfix groups name for a generated model and ref.
   */
  groupsName?: string;
  /**
   * Generate custom keys when SpecType is JSON.
   */
  customKeys?: boolean;
  /**
   * Inline enums when enum instead of using $ref.
   */
  inlineEnums?: boolean;
  /**
   * Explicit generic bindings used during schema compilation.
   *
   * Prefer attaching generics directly to a local schema instance with the
   * functional API:
   *
   * ```typescript
   * from(Pagination).genericOf(Product)
   * generic(Pagination).of(Product)
   * ```
   *
   * `options.generics` remains useful for low-level compilation flows where the
   * generic bindings must be supplied externally, for example when compiling a
   * shared class schema. When both are provided, the generics carried by the
   * `JsonSchema` instance take precedence over `options.generics`.
   */
  generics?: GenericsMap;

  [key: string]: any;
}
