import {useDecorators} from "@tsed/core";

import type {JsonPropertyStore} from "../../components/index.js";
import {JsonEntityFn} from "./jsonEntityFn.js";
import {Property} from "./property.js";

/**
 * Marks a property as the discriminator key for polymorphic type resolution.
 *
 * The `@DiscriminatorKey()` decorator identifies which property in a base class should
 * be used to determine the concrete type in inheritance hierarchies. This is essential
 * for proper serialization/deserialization of polymorphic objects and for generating
 * accurate OpenAPI schemas with discriminators.
 *
 * ### Basic Usage
 *
 * ```typescript
 * abstract class Animal {
 *   @DiscriminatorKey()
 *   type: string;
 *
 *   @Property()
 *   name: string;
 * }
 *
 * @DiscriminatorValue("dog")
 * class Dog extends Animal {
 *   @Property()
 *   breed: string;
 * }
 *
 * @DiscriminatorValue("cat")
 * class Cat extends Animal {
 *   @Property()
 *   indoor: boolean;
 * }
 * ```
 *
 * ### How It Works
 *
 * When deserializing, the framework:
 * 1. Reads the discriminator key property value
 * 2. Maps it to the correct concrete class using `@DiscriminatorValue()`
 * 3. Instantiates and validates the appropriate subclass
 *
 * ### With API Endpoints
 *
 * ```typescript
 * @Controller("/animals")
 * class AnimalController {
 *   @Post("/")
 *   async create(@BodyParams() animal: Animal) {
 *     // animal is automatically deserialized to Dog or Cat
 *     // based on the 'type' field in the request body
 *   }
 * }
 * ```
 *
 * ### OpenAPI Generation
 *
 * Generates discriminator object in OpenAPI spec:
 *
 * ```json
 * {
 *   "discriminator": {
 *     "propertyName": "type",
 *     "mapping": {
 *       "dog": "#/components/schemas/Dog",
 *       "cat": "#/components/schemas/Cat"
 *     }
 *   }
 * }
 * ```
 *
 * ### Payment Method Example
 *
 * ```typescript
 * abstract class PaymentMethod {
 *   @DiscriminatorKey()
 *   method: string;
 * }
 *
 * @DiscriminatorValue("credit_card")
 * class CreditCard extends PaymentMethod {
 *   @Property()
 *   cardNumber: string;
 *
 *   @Property()
 *   expiryDate: string;
 * }
 *
 * @DiscriminatorValue("bank_transfer")
 * class BankTransfer extends PaymentMethod {
 *   @Property()
 *   iban: string;
 *
 *   @Property()
 *   bic: string;
 * }
 * ```
 *
 * ### Use Cases
 *
 * - **Polymorphic APIs**: Endpoints accepting multiple related types
 * - **Event Systems**: Different event types with shared base structure
 * - **Strategy Pattern**: Multiple implementation variants
 * - **Type-Safe Deserialization**: Automatic instantiation of correct subclass
 * - **OpenAPI Documentation**: Clear polymorphic type documentation
 *
 * ### Best Practices
 *
 * - Use on abstract base classes
 * - Discriminator property should be required
 * - Combine with `@DiscriminatorValue()` on subclasses
 * - Use meaningful, stable discriminator values
 * - Document discriminator values in API documentation
 *
 * ### Important Notes
 *
 * - Only one discriminator key per class hierarchy
 * - The property is automatically marked with `@Property()`
 * - All subclasses must have distinct `@DiscriminatorValue()` decorators
 * - Discriminator values should be unique within the hierarchy
 *
 * @decorator
 * @property
 * @public
 * @see DiscriminatorValue
 */
export function DiscriminatorKey(): PropertyDecorator {
  return useDecorators(
    Property(),
    JsonEntityFn((store: JsonPropertyStore) => {
      store.parent.schema.discriminatorKey(String(store.propertyKey));
    })
  );
}
