import type {JSONSchema7Type} from "json-schema";
import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * Specifies a default value for a property in the JSON Schema.
 *
 * The `@Default()` decorator sets the default value that should be used when a property
 * is not provided in the input. This is primarily used for documentation in OpenAPI specs
 * and can be used by validation libraries that support default value insertion.
 *
 * ### Basic Usage
 *
 * ```typescript
 * class UserModel {
 *   @Default("guest")
 *   role: string = "guest";
 *
 *   @Default(0)
 *   loginCount: number = 0;
 *
 *   @Default(true)
 *   active: boolean = true;
 * }
 * ```
 *
 * Generated schema:
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "role": {
 *       "type": "string",
 *       "default": "guest"
 *     },
 *     "loginCount": {
 *       "type": "integer",
 *       "default": 0
 *     },
 *     "active": {
 *       "type": "boolean",
 *       "default": true
 *     }
 *   }
 * }
 * ```
 *
 * ### With Objects
 *
 * ```typescript
 * class ConfigModel {
 *   @Default({ theme: "light", lang: "en" })
 *   preferences: object = { theme: "light", lang: "en" };
 * }
 * ```
 *
 * ### With Arrays
 *
 * ```typescript
 * class ListModel {
 *   @Default([])
 *   items: string[] = [];
 * }
 * ```
 *
 * ### Dynamic Defaults with Functions
 *
 * ```typescript
 * class TimestampModel {
 *   @Default(() => new Date().toISOString())
 *   createdAt: string;
 *   // Default value computed at schema generation time
 * }
 * ```
 *
 * ### Use Cases
 *
 * - **Optional Configuration**: Provide sensible defaults for config properties
 * - **API Documentation**: Show default values in OpenAPI/Swagger docs
 * - **Form Generation**: Pre-populate form fields with default values
 * - **Database Models**: Document default column values
 *
 * ### Important Notes
 *
 * - The decorator adds default info to the schema but doesn't set TypeScript property initializers
 * - Recommended to match TypeScript initializer with decorator value for consistency
 * - Default value should be valid according to the property's schema
 * - Not all validation libraries automatically apply defaults
 *
 * ### With Validation
 *
 * ```typescript
 * class PaginationParams {
 *   @Default(10)
 *   @Minimum(1)
 *   @Maximum(100)
 *   limit: number = 10;
 *
 *   @Default(0)
 *   @Minimum(0)
 *   offset: number = 0;
 * }
 * ```
 *
 * @param defaultValue - The default value (or function returning the value)
 *
 * @decorator
 * @validation
 * @public
 */
export function Default(defaultValue: JSONSchema7Type | undefined | (() => JSONSchema7Type)) {
  return JsonEntityFn((store) => {
    store.itemSchema.default(defaultValue as any);
  });
}
