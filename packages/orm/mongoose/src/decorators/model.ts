import {applySchemaOptions, schemaOptions} from "../utils/schemaOptions.js";
import {createModel, getModelToken} from "../utils/createModel.js";
import {MONGOOSE_CONNECTIONS} from "../services/MongooseConnections.js";
import {MongooseModelOptions} from "../interfaces/MongooseModelOptions.js";
import {Schema} from "mongoose";
import {getSchema} from "../utils/createSchema.js";
import {injectable} from "@tsed/di";
import {useDecorators} from "@tsed/core";

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
 *        eventModel.findById().exec();
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
  return useDecorators((target: any) => {
    const {token, collectionName} = getModelToken(target, options);

    injectable(token).factory(() => getSchema(target, options as any));

    injectable(target)
      .type("mongoose:model")
      .deps([MONGOOSE_CONNECTIONS, token])
      .factory((...args: unknown[]) => {
        const [connections, schema] = args as [MONGOOSE_CONNECTIONS, Schema];

        applySchemaOptions(schema, schemaOptions(target));
        return createModel(
          target,
          schema,
          collectionName,
          options.collection,
          options.overwriteModels,
          connections.get(options.connection)
        );
      });
  });
}
