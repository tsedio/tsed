import {PropertyMetadata} from "../../mvc/models/PropertyMetadata";
import {PropertyFn} from "./property";

/**
 * Disable serialization for this property when the Converters service will render the JSON object.
 *
 * ::: warning
 * This decorator will be removed in v6 in favor of @@Ignore@@ from @tsed/schema.
 * For v5 user, use @@Ignore@@ decorator from @tsed/common then in v6 switch to @tsed/schema.
 * :::
 *
 * ::: tip
 * This decorator is used by the Converters to serialize correctly your model.
 * :::
 *
 * ::: warning
 * Swagger will not generate documentation for the ignored property.
 * :::
 *
 * ```typescript
 * class User {
 *   @Ignore()
 *   _id: string;
 *
 *   @Property()
 *   firstName: string;
 *
 *   @Property()
 *   lastName: string;
 *
 *   @Ignore()
 *   password: string;
 * }
 * ```
 *
 * The controller:
 * ```typescript
 * import {Post, Controller, BodyParams} from "@tsed/common";
 * import {Person} from "../models/Person";
 *
 * @Controller("/")
 * export class UsersCtrl {
 *
 *   @Get("/")
 *   get(): User {
 *       const user = new User();
 *       user._id = "12345";
 *       user.firstName = "John";
 *       user.lastName = "Doe";
 *       user.password = "secretpassword";
 *         return
 *   }
 * }
 * ```
 *
 * The expected json object:
 *
 * ```json
 * {
 *  "firstName": "John",
 *  "lastName": "Doe"
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @jsonMapper
 * @schema
 * @deprecated Use Ignore instead. Will be removed in v6.
 */
export function IgnoreProperty() {
  return PropertyFn((propertyMetadata: PropertyMetadata) => {
    propertyMetadata.ignoreProperty = true;
  });
}

/**
 * Disable serialization for this property when the Converters service will render the JSON object.
 *
 * ::: tip
 * This decorator is used by the Converters to serialize correctly your model.
 * :::
 *
 * ::: warning
 * Swagger will not generate documentation for the ignored property.
 * :::
 *
 * ```typescript
 * class User {
 *   @Ignore()
 *   _id: string;
 *
 *   @Property()
 *   firstName: string;
 *
 *   @Property()
 *   lastName: string;
 *
 *   @Ignore()
 *   password: string;
 * }
 * ```
 *
 * The controller:
 * ```typescript
 * import {Post, Controller, BodyParams} from "@tsed/common";
 * import {Person} from "../models/Person";
 *
 * @Controller("/")
 * export class UsersCtrl {
 *
 *   @Get("/")
 *   get(): User {
 *       const user = new User();
 *       user._id = "12345";
 *       user.firstName = "John";
 *       user.lastName = "Doe";
 *       user.password = "secretpassword";
 *         return
 *   }
 * }
 * ```
 *
 * The expected json object:
 *
 * ```json
 * {
 *  "firstName": "John",
 *  "lastName": "Doe"
 * }
 * ```
 *
 * @decorator
 * @jsonMapper
 * @schema
 * @alias IgnoreProperty
 */
export function Ignore() {
  return IgnoreProperty();
}
