import {IgnoreCallback} from "../../interfaces";
import {JsonEntityFn} from "./jsonEntityFn";

/**
 * Ignore the property when JsonMapper serialize the class to a Plain Object JavaScript.
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
 *   @Ignore((value, ctx) => !ctx.mongoose) // don't ignore prop only if mongoose
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
 *   @Get("/")
 *   get(): User {
 *     const user = new User();
 *     user._id = "12345";
 *     user.firstName = "John";
 *     user.lastName = "Doe";
 *     user.password = "secretpassword";
 *     return
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
 * @param cb Callback to know if the property must be ignored
 * @decorator
 * @validation
 * @swagger
 * @schema
 */
export function Ignore(cb: boolean | IgnoreCallback = () => true) {
  return JsonEntityFn((store) => {
    store.itemSchema.ignore(cb);
  });
}
