import {Type} from "@tsed/core";

import {Returns, ReturnsChainedDecorators} from "./returns.js";

/**
 * Add responses documentation for a specific status code.
 *
 * ## Usage
 *
 * Ts.ED v6 API introducing the chaining decorator concept.
 * Now a decorator like Returns can be used with another decorators like Description.
 *
 * ```typescript
 * import {Returns} from "@tsed/schema";
 *
 * @Controller("/")
 * class MyController {
 *   @Status(404, String).Description("Not Found")
 *   @Status(200, Model).Description("Success")
 *   async myMethod(): Promise<Model> {}
 * }
 * ```
 *
 * ::: tip
 * TypeScript and your IDE will discover automatically the chained decorators. But for more details you can look on @@ReturnsChainedDecorators@@ interface, to know
 * what chained decorators are available under Returns decorator.
 * :::
 *
 * This example will produce this documentation in swagger:
 *
 * ```json
 * {
 *   "responses": {
 *     "404": {
 *       "description": "Description",
 *       "schema": {"type": "string"}
 *     },
 *     "2OO": {
 *       "description": "Description",
 *       "schema": {"$ref": "..."}
 *     }
 *   }
 * }
 * ```
 *
 * ### Declaring a generic model
 *
 * Sometime, it might be useful to use generic models. TypeScript doesn't store the generic type in the metadata. This is why we need to
 * declare explicitly the generic models with the decorators.
 *
 * One of the generic's usage, can be a paginated list. With Returns decorator it's now possible to declare generic type and generate the appropriate OpenSpec documentation.
 *
 * Starting with the pagination model, by using @@Generics@@ and @@CollectionOf@@:
 *
 * ```typescript
 * @Generics("T")
 * class Pagination<T> {
 *  @CollectionOf("T")
 *  data: T[];
 *
 *  @Property()
 *  totalCount: number;
 * }
 * ```
 *
 * Now, we need a model to be used with the generic Pagination model:
 *
 * ```typescript
 * class Product {
 *  @Property()
 *  id: string;
 *
 *  @Property()
 *  title: string;
 * }
 * ```
 *
 * Finally, we can use our models on a method as following:
 *
 * ```typescript
 * class Controller {
 *   @OperationPath("POST", "/")
 *   @Status(200, Pagination).Of(Product).Description("description")
 *   async method(): Promise<Pagination<Product> | null> {
 *     return null;
 *   }
 * }
 * ```
 *
 * ### Declaring a nested generics models <Badge text="6+"/>
 *
 * It's also possible to declare a nested generics models in order to have this type `Pagination<Submission<Product>>`:
 *
 * ```typescript
 * import {Post, Generics, Property, Returns} from "@tsed/schema";
 *
 * class Controller {
 *   @Post("/")
 *   @Status(200, Pagination).Of(Submission).Nested(Product).Description("description")
 *   async method(): Promise<Pagination<Submission<Product>> | null> {
 *     return null;
 *   }
 * }
 * ```
 *
 * And here is the Submission model:
 *
 * ```typescript
 * import {Generics, Property} from "@tsed/schema";
 *
 * @Generics("T")
 * class Submission<T> {
 *   @Property()
 *   _id: string;
 *   @Property("T")
 *   data: T;
 * }
 * ```
 *
 * @param status
 * @param model
 * @decorator
 * @swagger
 * @schema
 * @response
 * @operation
 */
export function Status(status: string | number, model?: Type<any> | any): ReturnsChainedDecorators {
  return Returns(status, model);
}
