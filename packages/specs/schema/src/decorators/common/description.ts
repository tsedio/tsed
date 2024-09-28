import {DecoratorParameters, decoratorTypeOf, DecoratorTypes} from "@tsed/core";

import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import type {JsonMethodStore} from "../../domain/JsonMethodStore.js";
import type {JsonParameterStore} from "../../domain/JsonParameterStore.js";
import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * Add a description to the class, method or property
 *
 * ## Examples
 * ### On class
 *
 * ```typescript
 * @Description("description")
 * class Model {
 *
 * }
 * ```
 *
 * ### On method
 *
 * ```typescript
 * @Controller("/")
 * class ModelCtrl {
 *    @Description("description")
 *    async method() {}
 * }
 * ```
 *
 * ### On parameter
 *
 * ```typescript
 * @Controller("/")
 * class ModelCtrl {
 *    async method(@Description("description") @PathParam("id") id: string) {}
 * }
 * ```
 *
 * ### On property
 *
 * ```typescript
 * class Model {
 *    @Description("description")
 *    id: string;
 * }
 * ```
 *
 * @param {string} description
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 * @classDecorator
 * @methodDecorator
 * @propertyDecorator
 * @parameterDecorator
 */
export function Description(description: any) {
  return JsonEntityFn((store: JsonEntityStore, args: DecoratorParameters) => {
    switch (decoratorTypeOf(args)) {
      case DecoratorTypes.PROP:
      case DecoratorTypes.CLASS:
        store.schema.description(description);
        break;

      case DecoratorTypes.PARAM:
        (store as JsonParameterStore).parameter.description(description);
        break;

      case DecoratorTypes.METHOD:
        (store as JsonMethodStore).operation?.description(description);
        break;
    }
  });
}
