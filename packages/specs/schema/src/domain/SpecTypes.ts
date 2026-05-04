/**
 * Specification types supported by Ts.ED's schema system.
 *
 * This enum defines the different API specification formats that can be generated
 * from Ts.ED schemas. Each type affects how schemas are serialized and which
 * features are available.
 *
 * ### Specification Types
 *
 * - **JSON**: Pure JSON Schema (no OpenAPI-specific features)
 * - **SWAGGER**: Swagger 2.0 / OpenAPI 2.0 specification
 * - **OPENAPI**: OpenAPI 3.x specification (recommended)
 * - **ASYNCAPI**: AsyncAPI 2.x specification (for async/event-driven APIs)
 *
 * ### Usage
 *
 * ```typescript
 * import {SpecTypes} from "@tsed/schema";
 *
 * const schema = compile(MyModel, {
 *   specType: SpecTypes.OPENAPI
 * });
 * ```
 *
 * @public
 */
export enum SpecTypes {
  JSON = "jsonschema",
  SWAGGER = "swagger2",
  OPENAPI = "openapi3",
  ASYNCAPI = "asyncapi2"
}
