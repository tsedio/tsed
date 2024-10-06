import {nameOf, useDecorators} from "@tsed/core";
import {registerProvider} from "@tsed/di";
import {DiscriminatorValue} from "@tsed/schema";
import {Schema} from "mongoose";

import {MongooseModelOptions} from "../interfaces/MongooseModelOptions.js";
import {MONGOOSE_CONNECTIONS} from "../services/MongooseConnections.js";
import {createModel, getModelToken} from "../utils/createModel.js";
import {getSchema} from "../utils/createSchema.js";
import {applySchemaOptions, schemaOptions} from "../utils/schemaOptions.js";

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

    registerProvider({
      provide: token,
      deps: [],
      useFactory() {
        return getSchema(target, options as any);
      }
    });

    registerProvider({
      provide: target,
      type: "mongoose:model",
      deps: [MONGOOSE_CONNECTIONS, token],
      useFactory(connections: MONGOOSE_CONNECTIONS, schema: Schema) {
        applySchemaOptions(schema, schemaOptions(target));
        return createModel(
          target,
          schema,
          collectionName,
          options.collection,
          options.overwriteModels,
          connections.get(options.connection)
        );
      }
    });
  });
}
