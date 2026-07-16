import {JsonEntityFn} from "../common/jsonEntityFn.js";
import {snakeCase} from "change-case";

/**
 * Declares the discriminator value for a subclass in a polymorphic hierarchy.
 *
 * The `@DiscriminatorValue()` decorator specifies the value that should be present in the
 * discriminator key property to identify this specific subclass. This is used together with
 * `@DiscriminatorKey()` on the base class for proper polymorphic type resolution during
 * serialization and deserialization.
 *
 * ### Basic Usage
 *
 * ```typescript
 * abstract class Event {
 *   @DiscriminatorKey()
 *   type: string;
 *
 *   @Property()
 *   timestamp: Date;
 * }
 *
 * @DiscriminatorValue("page_view")
 * class PageView extends Event {
 *   @Property()
 *   url: string;
 *
 *   @Property()
 *   referrer: string;
 * }
 *
 * @DiscriminatorValue("action")
 * class Action extends Event {
 *   @Property()
 *   actionName: string;
 *
 *   @Property()
 *   metadata: object;
 * }
 * ```
 *
 * ### Auto-Generated Values
 *
 * If no value is provided, it auto-generates from the class name in snake_case:
 *
 * ```typescript
 * @DiscriminatorValue()  // Generates "custom_action"
 * class CustomAction extends Event {
 *   @Property()
 *   customField: string;
 * }
 * ```
 *
 * ### Multiple Values (Aliases)
 *
 * Support multiple discriminator values for the same class:
 *
 * ```typescript
 * @DiscriminatorValue("click", "tap", "press")
 * class ClickEvent extends Event {
 *   // Matches when type is "click", "tap", OR "press"
 * }
 * ```
 *
 * ### Payment Methods Example
 *
 * ```typescript
 * abstract class PaymentMethod {
 *   @DiscriminatorKey()
 *   type: string;
 * }
 *
 * @DiscriminatorValue("credit_card")
 * class CreditCardPayment extends PaymentMethod {
 *   @Property()
 *   cardNumber: string;
 *
 *   @Property()
 *   cvv: string;
 * }
 *
 * @DiscriminatorValue("paypal")
 * class PayPalPayment extends PaymentMethod {
 *   @Property()
 *   email: string;
 * }
 *
 * @DiscriminatorValue("bank_transfer")
 * class BankTransfer extends PaymentMethod {
 *   @Property()
 *   iban: string;
 * }
 * ```
 *
 * ### With API Endpoints
 *
 * ```typescript
 * @Post("/events")
 * async trackEvent(@BodyParams() event: Event) {
 *   // Framework automatically deserializes to correct subclass
 *   // based on the 'type' field value in request body
 *   if (event instanceof PageView) {
 *     // Handle page view
 *   } else if (event instanceof Action) {
 *     // Handle action
 *   }
 * }
 * ```
 *
 * ### OpenAPI Generation
 *
 * Generates proper discriminator mapping:
 *
 * ```json
 * {
 *   "discriminator": {
 *     "propertyName": "type",
 *     "mapping": {
 *       "page_view": "#/components/schemas/PageView",
 *       "action": "#/components/schemas/Action"
 *     }
 *   }
 * }
 * ```
 *
 * ### Use Cases
 *
 * - **Event Systems**: Different event types with shared structure
 * - **Payment Processing**: Multiple payment method types
 * - **Notification Systems**: Various notification channels
 * - **Content Types**: Polymorphic content (articles, videos, images)
 * - **API Responses**: Different response formats based on type
 *
 * ### Important Notes
 *
 * - Must be used on subclasses that extend a class with `@DiscriminatorKey()`
 * - Each subclass should have a unique discriminator value
 * - If omitted, value is auto-generated from class name (snake_case)
 * - Multiple values create aliases for backward compatibility
 * - Works with OpenAPI discriminator specification
 *
 * @param value - The discriminator value (auto-generated if omitted)
 * @param values - Additional alias values for this subclass
 *
 * @decorator
 * @public
 * @see DiscriminatorKey
 */
export function DiscriminatorValue(value?: string, ...values: string[]): ClassDecorator {
  return JsonEntityFn((store) => {
    value = value || snakeCase(store.targetName);
    if (store.discriminatorAncestor) {
      store.schema.discriminatorValue(value, ...values);
    }
  });
}
