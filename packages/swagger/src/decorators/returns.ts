import {mapReturnedResponse} from "@tsed/common";
import {Store, StoreFn, Type} from "@tsed/core";
import {ISwaggerResponses} from "../interfaces/ISwaggerResponses";

/**
 * Add responses documentation for a specific status code.
 *
 * ## Examples
 * ## With status code
 *
 * ```typescript
 *  @Returns(404, {description: "Not found"})
 *  @Returns(200, {description: "OK", type: Model})
 *  async myMethod(): Promise<Model>  {
 *
 *  }
 * ```
 *
 * This example will produce this documentation in swagger:
 *
 * ```json
 * {
 *   "responses": {
 *     "404": {
 *       "description": "Description"
 *     },
 *     "2OO": {
 *       "description": "Description",
 *       "schema": {"schemaOfModel": "..."}
 *     }
 *   }
 * }
 * ```
 *
 * ### Without status code
 *
 * Returns can be use without status code. In this case, the response will be added to the default status code
 * (200 or the status code seated with `@Status`).
 *
 * ```typescript
 *  @Returns({description: "Description"})
 *  async myMethod(): Promise<Model>  {
 *
 *  }
 * ```
 *
 * This example will produce this documentation in swagger:
 *
 * ```json
 * {
 *   "responses": {
 *     "200": {
 *       "description": "Description"
 *     }
 *   }
 * }
 * ```
 *
 * ### With type schema
 *
 * Returns accept another signature with a type.
 *
 * ```typescript
 *  @Returns(Model, {description: "Description"}) //OR
 *  @Returns(Model)
 *  async myMethod(): Promise<Model>  {
 *
 *  }
 * ```
 *
 * This example will produce this documentation in swagger:
 *
 * ```json
 * {
 *   "responses": {
 *     "200": {
 *       "description": "Description",
 *       "schema": {"schemaOfModel": "..."}
 *     }
 *   }
 * }
 * ```
 * @param statusCode Code status
 * @param options Swagger responses documentations
 * @returns {Function}
 * @decorator
 * @swagger
 */
export function Returns(statusCode: number, options: ISwaggerResponses): any;
export function Returns(options: ISwaggerResponses): any;
export function Returns(model: Type<any>): any;
export function Returns(model: Type<any>, options: ISwaggerResponses): any;
export function Returns(...args: any[]) {
  const configuration: any = {};

  args.forEach((value: any) => {
    configuration[typeof value] = value;
  });

  const {number: code, object: options = {} as any, function: type} = configuration;

  if (type) {
    options.type = type;
  }

  return StoreFn((store: Store) => {
    const response = mapReturnedResponse(options);

    if (code !== undefined) {
      store.merge("responses", {
        [code]: response
      });
    } else {
      store.merge("response", response);
    }
  });
}
