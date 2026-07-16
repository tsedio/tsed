import {JsonEntityFn} from "./jsonEntityFn.js";
import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
/**
 * Marks a property as write-only, indicating it should not be included in responses.
 *
 * The `@WriteOnly()` decorator sets the `writeOnly` flag in the JSON Schema, which signals
 * that this property should only appear in request payloads and be excluded from response
 * data. This is commonly used for sensitive data like passwords that should be accepted
 * as input but never returned to clients.
 *
 * ### Basic Usage - Passwords
 *
 * ```typescript
 * class UserModel {
 *   @Property()
 *   username: string;
 *   // Readable and writable
 *
 *   @WriteOnly()
 *   password: string;
 *   // Can be sent in requests but never returned in responses
 * }
 * ```
 *
 * ### Registration/Update Models
 *
 * ```typescript
 * class UserRegistration {
 *   @Property()
 *   email: string;
 *
 *   @WriteOnly()
 *   @MinLength(8)
 *   password: string;
 *
 *   @WriteOnly()
 *   passwordConfirmation: string;
 *   // Only needed for validation, never stored or returned
 * }
 * ```
 *
 * ### Sensitive Configuration
 *
 * ```typescript
 * class ApiKeyConfig {
 *   @Property()
 *   name: string;
 *
 *   @WriteOnly()
 *   apiKey: string;
 *   // Accept key in requests, but don't expose it in responses
 *
 *   @ReadOnly()
 *   createdAt: Date;
 *   // Only in responses
 * }
 * ```
 *
 * ### Toggle Write-Only
 *
 * ```typescript
 * class SecureModel {
 *   @WriteOnly(true)
 *   secret: string;
 *   // Write-only
 *
 *   @WriteOnly(false)
 *   publicField: string;
 *   // Explicitly not write-only (default behavior)
 * }
 * ```
 *
 * ### OpenAPI Behavior
 *
 * In OpenAPI/Swagger documentation:
 * - Write-only properties appear in **request** schemas
 * - Write-only properties are **excluded** from **response** schemas
 * - Helps document sensitive fields that shouldn't be returned
 *
 * ### vs ReadOnly
 *
 * - `@WriteOnly()`: Property can be written but not read (requests only)
 * - `@ReadOnly()`: Property can be read but not written (responses only)
 * - Neither: Property can be both read and written
 *
 * ### Common Use Cases
 *
 * - **Passwords**: Authentication credentials that should never be exposed
 * - **Secret Keys**: API keys, tokens, or other sensitive credentials
 * - **Confirmation Fields**: Password confirmation, email confirmation
 * - **Temporary Inputs**: Fields used only for processing, not storage
 * - **Security Tokens**: CSRF tokens or one-time codes
 *
 * ### Security Best Practices
 *
 * ```typescript
 * class ChangePassword {
 *   @WriteOnly()
 *   @MinLength(8)
 *   currentPassword: string;
 *
 *   @WriteOnly()
 *   @MinLength(8)
 *   newPassword: string;
 *
 *   @WriteOnly()
 *   newPasswordConfirmation: string;
 *   // All password fields are write-only
 * }
 * ```
 *
 * ### Important Notes
 *
 * - `@WriteOnly()` is a schema hint for documentation and client validation
 * - Server-side code must still explicitly exclude these fields from responses
 * - Use serialization groups or DTOs to ensure write-only fields aren't leaked
 * - Always hash/encrypt sensitive data before storage
 *
 * @param writeOnly - Whether the property is write-only (default: true)
 *
 * @decorator
 * @validation
 * @public
 */
export function WriteOnly(writeOnly: boolean = true) {
  return JsonEntityFn((store: JsonEntityStore) => {
    store.itemSchema.writeOnly(writeOnly);
  });
}
