import {decoratorTypeOf, DecoratorTypes, StaticMethodDecorator} from "@tsed/core";

import {MongooseHookOptions, MongoosePostHookCB} from "../interfaces/MongooseSchemaOptions.js";
import {schemaOptions} from "../utils/schemaOptions.js";

/**
 * We can simply attach a `@PostHook` decorator to your model class and
 * define the hook function like you normally would in Mongoose.
 *
 * ```typescript
 * import {Ignore, Required} from "@tsed/platform-http";
 * import {PostHook, Model} from "@tsed/mongoose";
 *
 * @Model()
 * @PostHook("save", (car: CarModel) => {
 *    if (car.topSpeedInKmH > 300) {
 *        console.log(car.model, 'is fast!');
 *    }
 * })
 * export class CarModel {
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
 *    @PostHook("save")
 *    static postSave(car: CarModel) {
 *       if (car.topSpeedInKmH > 300) {
 *           console.log(car.model, 'is fast!');
 *       }
 *    }
 * }
 * ```
 *
 * This will execute the post-save hook each time a `CarModel` document is saved.
 *
 * @param {string} method
 * @param fn
 * @returns {Function}
 * @decorator
 * @mongoose
 * @class
 */
export function PostHook<T = any>(method: string, fn: MongoosePostHookCB<T>): ClassDecorator;
export function PostHook<T = any>(method: string, fn: MongoosePostHookCB<T>, options: MongooseHookOptions): ClassDecorator;
export function PostHook<T = any>(method: string, options: MongooseHookOptions): StaticMethodDecorator;
export function PostHook<T = any>(method: string, ...params: any[]): Function {
  return ((...args: any[]) => {
    let options: MongooseHookOptions = params[1];
    let fn: MongoosePostHookCB<T> = params[0];

    if (decoratorTypeOf(args) === DecoratorTypes.METHOD_STC) {
      options = params[0];
      fn = args[0][args[1]].bind(args[0]);
    }

    schemaOptions(args[0], {
      post: [
        {
          method,
          fn,
          options
        }
      ]
    });
  }) as any;
}
