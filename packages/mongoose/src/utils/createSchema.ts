import {getClass, Store, Type} from "@tsed/core";
import {ConverterService, IConverterOptions} from "@tsed/common";
import * as mongoose from "mongoose";
import {MONGOOSE_SCHEMA} from "../constants";
import {MongooseSchema, MongooseSchemaOptions} from "../interfaces";
import {buildMongooseSchema} from "./buildMongooseSchema";
import {applySchemaOptions} from "./schemaOptions";

function setUpTarget(target: Type<any>) {
  target.prototype.serialize = function(options: IConverterOptions, converter: ConverterService) {
    const {checkRequiredValue, ignoreCallback} = options;

    return converter.serializeClass(this, {
      type: getClass(target),
      checkRequiredValue,
      ignoreCallback
    });
  };
}

function setUpSchema({schema, virtuals}: MongooseSchema, options?: mongoose.SchemaOptions) {
  const mongooseSchema = new mongoose.Schema(schema, options);

  for (const [key, options] of virtuals.entries()) {
    mongooseSchema.virtual(key, options);
  }

  return mongooseSchema;
}

/**
 *
 * @param {Type<any>} target
 * @param {"mongoose".SchemaOptions} options
 * @returns {"mongoose".Schema}
 */
export function createSchema(target: Type<any>, options: MongooseSchemaOptions = {}): mongoose.Schema {
  const store = Store.from(target);

  if (!store.has(MONGOOSE_SCHEMA)) {
    const schema = setUpSchema(buildMongooseSchema(target), options.schemaOptions);
    store.set(MONGOOSE_SCHEMA, schema);
    applySchemaOptions(target, options);
    setUpTarget(target);
    schema.loadClass(target);
  }

  return store.get(MONGOOSE_SCHEMA);
}
