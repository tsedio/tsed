import {decoratorTypeOf, DecoratorTypes, StaticMethodDecorator} from "@tsed/core";

import type {MongooseHookOptions, MongooseMethods, MongoosePreHookCB} from "../interfaces/MongooseSchemaOptions.js";
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
 * @returns {Function}
 * @decorator
 * @class
 * @param method
 * @param fn
 * @param options
 */
export function PreHook<T = any>(method: MongooseMethods, fn: MongoosePreHookCB<T>, options?: MongooseHookOptions): ClassDecorator;
export function PreHook<T = any>(method: MongooseMethods, options?: MongooseHookOptions): StaticMethodDecorator;
export function PreHook<T = any>(method: MongooseMethods, ...decoratorArgs: any[]): ClassDecorator | StaticMethodDecorator {
  return (...args: any[]) => {
    if (decoratorTypeOf(args) === DecoratorTypes.METHOD_STC) {
      schemaOptions(args[0], {
        pre: [
          {
            method,
            fn: args[0][args[1]].bind(args[0]),
            options: decoratorArgs[0]
          }
        ]
      });
    } else {
      schemaOptions(args[0], {
        pre: [
          {
            method,
            fn: decoratorArgs[0],
            options: decoratorArgs[1]
          }
        ]
      });
    }
  };
}
