import {JsonEntityFn} from "./jsonEntityFn.js";
import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
/**
 * Marks a property as read-only, indicating it should not be modified by clients.
 *
 * The `@ReadOnly()` decorator sets the `readOnly` flag in the JSON Schema, which signals
 * to validators and API consumers that this property is for reading only and should not
 * be included in request payloads. In OpenAPI specs, read-only properties are excluded
 * from request body schemas but included in response schemas.
 *
 * ### Basic Usage
 *
 * ```typescript
 * class UserModel {
 *   @ReadOnly()
 *   id: string;
 *   // Server-generated, clients cannot set this
 *
 *   @ReadOnly()
 *   createdAt: Date;
 *   // Timestamp set by server
 *
 *   @Property()
 *   name: string;
 *   // Can be read and written
 * }
 * ```
 *
 * ### Server-Generated Fields
 *
 * ```typescript
 * class PostModel {
 *   @ReadOnly()
 *   id: number;
 *
 *   @ReadOnly()
 *   @Default(() => new Date())
 *   createdAt: Date;
 *
 *   @ReadOnly()
 *   @Default(() => new Date())
 *   updatedAt: Date;
 *
 *   @Property()
 *   title: string;
 *
 *   @Property()
 *   content: string;
 * }
 * ```
 *
 * ### Computed Properties
 *
 * ```typescript
 * class OrderModel {
 *   @Property()
 *   items: OrderItem[];
 *
 *   @ReadOnly()
 *   get totalPrice(): number {
 *     return this.items.reduce((sum, item) => sum + item.price, 0);
 *   }
 *   // Computed value, clients cannot set it
 * }
 * ```
 *
 * ### Toggle Read-Only
 *
 * ```typescript
 * class ConfigModel {
 *   @ReadOnly(true)
 *   lockedField: string;
 *   // Read-only
 *
 *   @ReadOnly(false)
 *   editableField: string;
 *   // Explicitly not read-only (default behavior)
 * }
 * ```
 *
 * ### OpenAPI Behavior
 *
 * In OpenAPI/Swagger documentation:
 * - Read-only properties appear in **response** schemas
 * - Read-only properties are **excluded** from **request** schemas
 * - Helps generate accurate API documentation
 *
 * ### vs WriteOnly
 *
 * - `@ReadOnly()`: Property can be read but not written (responses only)
 * - `@WriteOnly()`: Property can be written but not read (requests only)
 * - Neither: Property can be both read and written
 *
 * ### Use Cases
 *
 * - **Database IDs**: Auto-generated primary keys
 * - **Timestamps**: Server-managed created/updated dates
 * - **Computed Values**: Derived or calculated properties
 * - **System Metadata**: Internal tracking fields
 * - **Audit Fields**: Who created/modified records
 *
 * ### Security Note
 *
 * While `@ReadOnly()` provides documentation and client-side validation hints, it does
 * not enforce security at the server level. Always validate incoming data server-side
 * and ignore read-only fields in request payloads.
 *
 * @param readOnly - Whether the property is read-only (default: true)
 *
 * @decorator
 * @validation
 * @public
 */
export function ReadOnly(readOnly: boolean = true) {
  return JsonEntityFn((store: JsonEntityStore) => {
    store.itemSchema.readOnly(readOnly);
  });
}
