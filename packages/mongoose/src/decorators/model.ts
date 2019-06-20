import {MongooseModelOptions} from "../interfaces/MongooseModelOptions";
import {registerModel} from "../registries/MongooseModelRegistry";
import {createModel, getSchema} from "../utils";
import {applySchemaOptions} from "../utils/schemaOptions";

/**
 * Define a class as a Mongoose Model. The model can be injected to the Service, Controller, Middleware, Converters or Filter with
 * `@Inject` annotation.
 *
 * ### Example
 *
 * ```typescript
 * @Model()
 * export class EventModel {
 *   @Property()
 *   field: string;
 * }
 * ```
 *
 * Then inject the model into a service:
 *
 * ```typescript
 * class MyService {
 *    constructor(@Inject(EventModel) eventModel: MongooseModel<EventModel>) {
 *        eventModel.find().exec();
 *    }
 * }
 * ```
 *
 * ### Options
 *
 * - `schemaOptions` (mongoose.SchemaOptions): Option to configure the schema behavior.
 * - `name` (String): model name.
 * - `collection` (String): collection (optional, induced from model name).
 * - `skipInit` (Boolean): skipInit whether to skip initialization (defaults to false).
 *
 * @param {MongooseModelOptions} options
 * @returns {(target: any) => void}
 * @decorator
 * @mongoose
 * @class
 */
export function Model(options: MongooseModelOptions = {}) {
  return (target: any) => {
    registerModel(target, createModel(target, getSchema(target, options), options.name, options.collection, options.skipInit));
    applySchemaOptions(target, {});
  };
}
