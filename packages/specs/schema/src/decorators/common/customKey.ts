import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * Adds a custom key-value pair to the JSON Schema that is not part of the official spec.
 *
 * The `@CustomKey()` decorator allows adding vendor-specific extensions or custom metadata
 * to schemas. These custom keys are only included in the generated schema when explicitly
 * requested with the `customKeys: true` option in `compile()`.
 *
 * ### Basic Usage
 *
 * ```typescript
 * class UserModel {
 *   @CustomKey("x-internal-id", "USER_001")
 *   @Property()
 *   username: string;
 * }
 * ```
 *
 * ### Vendor Extensions
 *
 * Following OpenAPI conventions, use `x-` prefix for custom extensions:
 *
 * ```typescript
 * class ApiModel {
 *   @CustomKey("x-visibility", "internal")
 *   @CustomKey("x-deprecated-by", "newField")
 *   @Property()
 *   oldField: string;
 * }
 * ```
 *
 * ### Documentation Metadata
 *
 * ```typescript
 * class ProductModel {
 *   @CustomKey("x-example-source", "marketing-team")
 *   @CustomKey("x-last-reviewed", "2024-01-15")
 *   @Property()
 *   description: string;
 * }
 * ```
 *
 * ### Integration Hints
 *
 * ```typescript
 * class DataModel {
 *   @CustomKey("x-database-column", "user_full_name")
 *   @CustomKey("x-searchable", true)
 *   @Property()
 *   fullName: string;
 * }
 * ```
 *
 * ### Retrieving Custom Keys
 *
 * Custom keys must be explicitly requested:
 *
 * ```typescript
 * import { compile } from "@tsed/schema";
 *
 * const schema = compile(UserModel, { customKeys: true });
 * // Schema will include x-internal-id and other custom keys
 *
 * const standardSchema = compile(UserModel);
 * // Custom keys are omitted by default
 * ```
 *
 * ### Use Cases
 *
 * - **OpenAPI Extensions**: Add vendor-specific OpenAPI extensions
 * - **Tool Integration**: Metadata for code generators or documentation tools
 * - **Internal Tracking**: Development or operational metadata
 * - **Feature Flags**: Schema-level feature flag information
 * - **Database Mapping**: ORM or database column hints
 *
 * @param key - The custom key name (use `x-` prefix for vendor extensions)
 * @param value - The value to associate with the key
 *
 * @decorator
 * @validation
 * @public
 */
export function CustomKey(key: string, value: any) {
  return JsonEntityFn((store: JsonEntityStore) => {
    store.itemSchema.customKey(key, value);
  });
}

/**
 * Adds multiple custom key-value pairs to the JSON Schema in one decorator.
 *
 * The `@CustomKeys()` decorator is a convenience function for adding multiple custom
 * keys at once. Like `@CustomKey()`, these keys are only included when explicitly
 * requested with `customKeys: true`.
 *
 * ### Basic Usage
 *
 * ```typescript
 * class ProductModel {
 *   @CustomKeys({
 *     "x-internal-code": "PROD-123",
 *     "x-category": "electronics",
 *     "x-priority": "high"
 *   })
 *   @Property()
 *   name: string;
 * }
 * ```
 *
 * ### Multiple Vendor Extensions
 *
 * ```typescript
 * class ApiEndpoint {
 *   @CustomKeys({
 *     "x-rate-limit": 100,
 *     "x-requires-auth": true,
 *     "x-cache-ttl": 3600,
 *     "x-deprecated": false
 *   })
 *   @Property()
 *   endpoint: string;
 * }
 * ```
 *
 * ### Equivalent to Multiple @CustomKey
 *
 * These are equivalent:
 *
 * ```typescript
 * // Using @CustomKeys
 * @CustomKeys({ "x-foo": "bar", "x-baz": "qux" })
 * field: string;
 *
 * // Using multiple @CustomKey
 * @CustomKey("x-foo", "bar")
 * @CustomKey("x-baz", "qux")
 * field: string;
 * ```
 *
 * ### Use Cases
 *
 * - **Bulk Metadata**: Add multiple related custom properties efficiently
 * - **Configuration**: Group related custom configuration values
 * - **Tool Directives**: Multiple hints for code generation or documentation
 *
 * @param obj - Object containing custom key-value pairs
 *
 * @decorator
 * @validation
 * @public
 */
export function CustomKeys(obj: Record<string, any>) {
  return JsonEntityFn((store: JsonEntityStore) => {
    Object.entries(obj).forEach(([key, value]) => {
      store.itemSchema.customKey(key, value);
    });
  });
}
