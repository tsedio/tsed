import {IResponseOptions, Returns as R, ReturnsArray as RA} from "@tsed/common";
import {Type} from "@tsed/core";
import {ReturnsChainedDecorators} from "@tsed/schema";

/**
 * @deprecated
 * @ignore
 * @param args
 */
function mapStatusResponseOptions(args: any[]): any {
  const configuration: any = {};

  args.forEach((value: any) => {
    configuration[typeof value] = value;
  });

  const {number: code, object: options = {} as any, function: type} = configuration;

  if (type) {
    options.type = type;
  }

  return {
    ...options,
    code,
    type: options.type || options.use,
    collectionType: options.collectionType || options.collection
  };
}

/**
 * @deprecated
 */
export function Returns(statusCode: number, options: Partial<IResponseOptions>): ReturnsChainedDecorators;
/**
 * @deprecated
 */
export function Returns(options: Partial<IResponseOptions>): ReturnsChainedDecorators;
/**
 * @deprecated
 */
export function Returns(model: Type<any>): ReturnsChainedDecorators;
/**
 * @deprecated
 */
export function Returns(model: Type<any>, options: Partial<IResponseOptions>): ReturnsChainedDecorators;
/**
 * Add responses documentation for a specific status code.
 *
 * ::: warning
 * This decorator will be removed in v6 in favor of @@Returns@@ from @tsed/schema.
 * For v5 user, use @@Returns@@ decorator from @tsed/common then in v6 switch to @tsed/schema.
 * :::
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
 * @ignore
 * @deprecated Use @Returns decorator from @tsed/common.
 * @deprecated Use @Returns from @tsed/schema
 */
export function Returns(...args: any[]): ReturnsChainedDecorators {
  return ReturnType(mapStatusResponseOptions(args));
}
/**
 * @deprecated
 */
export function ReturnsArray(statusCode: number, options: Partial<IResponseOptions>): ReturnsChainedDecorators;
/**
 * @deprecated
 */
export function ReturnsArray(options: Partial<IResponseOptions>): ReturnsChainedDecorators;
/**
 * @deprecated
 */
export function ReturnsArray(model: Type<any>): ReturnsChainedDecorators;
/**
 * @deprecated
 */
export function ReturnsArray(model: Type<any>, options: Partial<IResponseOptions>): ReturnsChainedDecorators;
/**
 * Add responses documentation for a specific status code.
 *
 * ::: warning
 * This decorator will be removed in v6 in favor of @@Returns@@ from @tsed/schema.
 * For v5 user, use @@ReturnsArray@@ decorator from @tsed/common then in v6 switch to `@Returns(Array).Of(User)` from @tsed/schema.
 * :::
 *
 * ## Examples
 * ## With status code
 *
 * ```typescript
 *  @ReturnsArray(200, {description: "OK", type: Model})
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
 *     "2OO": {
 *       "description": "Description",
 *       "schema": {"type": "array"}
 *     }
 *   }
 * }
 * ```
 *
 * ### Without status code
 *
 * ReturnsArray can be use without status code. In this case, the response will be added to the default status code
 * (200 or the status code seated with `@Status`).
 *
 * ```typescript
 *  @ReturnsArray({description: "Description"})
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
 *       "schema": {"type": "array"}
 *     }
 *   }
 * }
 * ```
 *
 * ### With type schema
 *
 * ReturnsArray accept another signature with a type.
 *
 * ```typescript
 *  @ReturnsArray(Model, {description: "Description"}) //OR
 *  @ReturnsArray(Model)
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
 *       "schema": {
 *         "type": "array",
 *         "items": {
 *           $ref: "Model"
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param statusCode Code status
 * @param options Swagger responses documentations
 * @returns {Function}
 * @decorator
 * @swagger
 * @ignore
 * @deprecated Use @ReturnsArray decorator from @tsed/common.
 * @deprecated Use @Returns from @tsed/schema
 */
export function ReturnsArray(...args: any[]): ReturnsChainedDecorators {
  return ReturnType({...mapStatusResponseOptions(args), collectionType: Array});
}
