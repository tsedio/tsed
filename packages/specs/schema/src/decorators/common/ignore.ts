import {IgnoreCallback} from "../../interfaces/IgnoreCallback.js";
import {JsonEntityFn} from "./jsonEntityFn.js";

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
 *   @Ignore((value, ctx) => !ctx.endpoint)
 *   password: string;
 * }
 * ```
 *
 * The controller:
 * ```typescript
 * import {Controller, BodyParams} from "@tsed/platform-http";
 * import {Post} from "@tsed/schema";
 * import {Person} from "../models/Person.js";
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
 * @deprecated Since v7. Use @Groups decorator instead of and enable `jsonMapper.strictGroups` in your configuration.
 */
export function Ignore(cb: boolean | IgnoreCallback = true) {
  return JsonEntityFn((store) => {
    store.schema.ignore(cb);
  });
}
