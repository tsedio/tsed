import {Allow} from "./allow.js";
import {Optional} from "./optional.js";
import {withErrorMsg} from "../../utils/withErrorMsg.js";

/**
 * Mark a property or parameter as required.
 *
 * The `@Required()` decorator enforces that a property must have a value during
 * validation. It works on both model properties and method parameters, and triggers
 * validation errors when values are `null`, `undefined`, or empty strings.
 *
 * ### Usage on Properties
 *
 * ```typescript
 * class User {
 *   @Required()
 *   @Property()
 *   email: string;
 *
 *   @Required()
 *   @Property()
 *   name: string;
 * }
 * ```
 *
 * ### Usage on Parameters
 *
 * ```typescript
 * @Controller("/users")
 * class UserController {
 *   @Post("/")
 *   async create(@Required() @BodyParams() user: User) {
 *     // user is required in request body
 *   }
 *
 *   @Get("/:id")
 *   async get(@Required() @PathParams("id") id: string) {
 *     // id is required in path
 *   }
 * }
 * ```
 *
 * ### Validation Behavior
 *
 * By default, `@Required()` rejects:
 * - `null` values
 * - `undefined` values
 * - Empty strings (`""`)
 *
 * ### Allowing Specific Values
 *
 * Use `@Allow()` to permit specific values that would normally be rejected:
 *
 * ```typescript
 * class Model {
 *   // Allow empty string but still mark as required
 *   @Required()
 *   @Allow("")
 *   optionalText: string;
 *
 *   // Allow null
 *   @Required()
 *   @Allow(null)
 *   nullableField: string | null;
 * }
 * ```
 *
 * ### Making Optional
 *
 * To explicitly mark a property as optional:
 *
 * ```typescript
 * class Model {
 *   @Required(false) // or use @Optional()
 *   optionalField: string;
 * }
 * ```
 *
 * @param required - Whether the property/parameter is required (default: true)
 * @param allowedRequiredValues - Values to allow even when marked as required
 *
 * @decorator
 * @public
 */
export const Required = withErrorMsg("required", (required: boolean = true, ...allowedRequiredValues: any[]) => {
  return required ? Allow(...allowedRequiredValues) : Optional();
});
