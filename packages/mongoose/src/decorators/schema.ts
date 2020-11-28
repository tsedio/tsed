import {Property} from "@tsed/common";
import {decoratorTypeOf, StoreMerge, useDecorators} from "@tsed/core";
import {SchemaTypeOpts} from "mongoose";
import {MONGOOSE_SCHEMA} from "../constants";
import {MongooseSchemaOptions} from "../interfaces";
import {createSchema} from "../utils/createSchema";

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
 * @property
 * @class
 */
export function Schema(options?: MongooseSchemaOptions): (target: any) => void;
export function Schema(definition: SchemaTypeOpts<any>): Function;
export function Schema(options: MongooseSchemaOptions | SchemaTypeOpts<any> = {}) {
  return (...parameters: any[]) => {
    switch (decoratorTypeOf(parameters)) {
      case "property":
        return useDecorators(Property(), StoreMerge(MONGOOSE_SCHEMA, options))(parameters[0], parameters[1], parameters[2]);

      case "class":
        StoreMerge(MONGOOSE_SCHEMA, createSchema(parameters[0], options as MongooseSchemaOptions))(...parameters);
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
 * @property
 * @class
 */
export function MongooseSchema(options?: MongooseSchemaOptions): (target: any) => void;
export function MongooseSchema(definition: SchemaTypeOpts<any>): Function;
export function MongooseSchema(options: MongooseSchemaOptions | SchemaTypeOpts<any> = {}) {
  return Schema(options);
}
