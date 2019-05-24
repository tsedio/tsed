import {Property} from "@tsed/common";
import {applyDecorators, getDecoratorType, StoreMerge} from "@tsed/core";
import {createSchema} from "@tsed/mongoose";
import {SchemaTypeOpts} from "mongoose";
import {MONGOOSE_SCHEMA} from "../constants";
import {MongooseSchemaOptions} from "../interfaces";

/**
 * Define a class as a Mongoose Schema ready to be used to compose other schemes and models.
 *
 * ### Example
 *
 * ```typescript
 * @Schema()
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
/**
 * Attach a schema on property class.
 *
 * @param {SchemaTypeOpts<any>} definition
 * @returns {Function}
 * @decorator
 * @mongoose
 */
export function Schema(definition: SchemaTypeOpts<any>): Function;
export function Schema(options: MongooseSchemaOptions | SchemaTypeOpts<any> = {}) {
  return (...parameters: any[]) => {
    switch (getDecoratorType(parameters)) {
      case "property":
        return applyDecorators(Property(), StoreMerge(MONGOOSE_SCHEMA, options))(...parameters);

      case "class":
        StoreMerge(MONGOOSE_SCHEMA, createSchema(parameters[0], options as MongooseSchemaOptions))(...parameters);
        break;
    }
  };
}
