import {getDecoratorType} from "@tsed/core";
import {PropertyMetadata, PropertyRegistry} from "@tsed/common";
import {SchemaTypeOpts} from "mongoose";
import {MONGOOSE_SCHEMA} from "../constants";
import {MongooseSchemaOptions} from "../interfaces";
import {createSchema} from "../utils";

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
        return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
          propertyMetadata.store.merge(MONGOOSE_SCHEMA, options as SchemaTypeOpts<any>);
        })(...parameters);
      case "class":
        const [target] = parameters;
        createSchema(target, options as MongooseSchemaOptions);
        break;
    }
  };
}
