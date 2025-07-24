import {DecoratorParameters, DecoratorTypes} from "@tsed/core";

import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
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
    if (store.is(DecoratorTypes.PROP) || store.is(DecoratorTypes.CLASS)) {
      store.schema.description(description);
    } else if (store.is(DecoratorTypes.PARAM)) {
      store.parameter.description(description);
    } else if (store.is(DecoratorTypes.METHOD)) {
      store.operation?.description(description);
    }
  });
}
