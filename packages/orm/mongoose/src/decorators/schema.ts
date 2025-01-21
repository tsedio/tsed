import {decoratorTypeOf, StoreMerge, useDecorators} from "@tsed/core";
import {injectable} from "@tsed/di";
import {Property} from "@tsed/schema";
import mongoose, {SchemaTypeOptions} from "mongoose";

import {MONGOOSE_SCHEMA} from "../constants/constants.js";
import {MongooseSchemaOptions} from "../interfaces/MongooseSchemaOptions.js";
import {getSchema, getSchemaToken} from "../utils/createSchema.js";

new mongoose.Schema({
  test: {}
});
/**
 * Let you configure a @@MongooseSchemaOptions@@ on a class or a SchemaTypeOptions on a property.
 *
 * See [SchemaTypeOptions]() on mongoose documentation for more details.
 *
 * ### Example
 *
 * ```typescript
 * import {Schema} from "@tsed/mongoose";
 * import {Property} from "@tsed/schema";
 *
 * @Schema({})
 * export class EventSchema {
 *   @Property()
 *   field: string;
 * }
 *
 * or
 *
 * export class EventSchema {
 *   @Property()
 *   @Schema({})
 *   field: string;
 * }
 * ```
 *
 * ### Options
 *
 * - `schemaOptions` (mongoose.SchemaOptions): Option to configure the schema behavior.
 *
 * @param {MongooseSchemaOptions | undefined} options
 * @returns {(target: any) => void}
 * @decorator
 * @mongoose
 * @property
 * @class
 */
export function Schema(options?: MongooseSchemaOptions): ClassDecorator;
export function Schema(definition: SchemaTypeOptions<any>): PropertyDecorator;
export function Schema(options: MongooseSchemaOptions | SchemaTypeOptions<any> = {}): ClassDecorator | PropertyDecorator {
  return (...parameters: any[]) => {
    switch (decoratorTypeOf(parameters)) {
      case "property":
        return useDecorators(Property(), StoreMerge(MONGOOSE_SCHEMA, options))(parameters[0], parameters[1], parameters[2]);

      case "class":
        const {token} = getSchemaToken(parameters[0], options);

        injectable(token).factory(() => getSchema(parameters[0], options as any));
        break;
    }
  };
}

/**
 * Define a class as a Mongoose Schema ready to be used to compose other schemes and models.
 *
 * ### Example
 *
 * ```typescript
 * @MongooseSchema()
 * export class EventSchema {
 *   @Property()
 *   field: string;
 * }
 * ```
 *
 * ### Options
 *
 * - `schemaOptions` (mongoose.SchemaOptions): Option to configure the schema behavior.
 *
 * @param {MongooseSchemaOptions | undefined} options
 * @returns {(target: any) => void}
 * @decorator
 * @mongoose
 * @alias Schema from @tsed/mongoose package
 * @property
 * @class
 */
export function MongooseSchema(options?: MongooseSchemaOptions): ClassDecorator;
export function MongooseSchema(definition: SchemaTypeOptions<any>): PropertyDecorator;
export function MongooseSchema(options: MongooseSchemaOptions | SchemaTypeOptions<any> = {}): ClassDecorator | PropertyDecorator {
  return Schema(options as any);
}
