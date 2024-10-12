import {decoratorTypeOf, DecoratorTypes} from "@tsed/core";

import {MongooseHookOptions, MongoosePreHookCB} from "../interfaces/MongooseSchemaOptions.js";
import {schemaOptions} from "../utils/schemaOptions.js";

/**
 *
 * We can simply attach a `@PreHook` decorator to your model class and
 * define the hook function like you normally would in Mongoose.
 *
 * ```typescript
 * import {Ignore, Required} from "@tsed/platform-http";
 * import {PreHook, Model} from "@tsed/mongoose";
 *
 * @Model()
 * @PreHook("save", (car: CarModel, next) => {
 *    if (car.model === 'Tesla') {
 *        car.isFast = true;
 *      }
 *      next();
 *})
 * export class CarModel {
 *
 *    @Ignore()
 *    _id: string;
 *
 *    @Required()
 *    model: string;
 *
 *    @Required()
 *    isFast: boolean;
 *
 *    // or Prehook on static method
 *    @PreHook("save")
 *    static preSave(car: CarModel, next) {
 *       if (car.model === 'Tesla') {
 *           car.isFast = true;
 *       }
 *       next();
 *    }
 * }
 * ```
 *
 * This will execute the pre-save hook each time a `CarModel` document is saved.
 *
 * @param {string} method
 * @param fn
 * @param options
 * @returns {Function}
 * @decorator
 * @class
 */
export function PreHook<T = any>(method: string, fn?: MongoosePreHookCB<T> | MongooseHookOptions, options?: MongooseHookOptions): Function {
  return (...args: any[]) => {
    if (decoratorTypeOf(args) === DecoratorTypes.METHOD_STC) {
      options = fn as MongooseHookOptions;
      fn = args[0][args[1]].bind(args[0]);
    }

    schemaOptions(args[0], {
      pre: [
        {
          method,
          fn: fn as MongoosePreHookCB<T>,
          options
        }
      ]
    });
  };
}
