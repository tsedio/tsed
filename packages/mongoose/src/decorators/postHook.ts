import {getDecoratorType} from "@tsed/core";
import {MongoosePostErrorHookCB, MongoosePostHookCB} from "../interfaces";
import {applySchemaOptions} from "../utils/schemaOptions";

/**
 * We can simply attach a `@PostHook` decorator to your model class and
 * define the hook function like you normally would in Mongoose.
 *
 * ```typescript
 * import {IgnoreProperty, Required} from "@tsed/common";
 * import {PostHook, Model} from "@tsed/mongoose";
 *
 * @Model()
 * @PostHook("save", (car: CarModel) => {
 *    if (car.topSpeedInKmH > 300) {
 *        console.log(car.model, 'is fast!');
 *    }
 * })
 * export class CarModel {
 *    @IgnoreProperty()
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
 * @param {MongoosePostHookCB<any> | MongoosePostErrorHookCB<any>} fn
 * @returns {Function}
 * @decorator
 * @mongoose
 * @class
 */
export function PostHook(method: string, fn?: MongoosePostHookCB<any> | MongoosePostErrorHookCB<any>): Function {
  return (...args: any[]) => {
    if (getDecoratorType(args) === "method") {
      fn = args[0][args[1]].bind(args[0]);
    }

    applySchemaOptions(args[0], {
      post: [
        {
          method,
          fn: fn as MongoosePostHookCB<any> | MongoosePostErrorHookCB<any>
        }
      ]
    });
  };
}
