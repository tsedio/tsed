import {Store, Type} from "@tsed/core";
import * as mongoose from "mongoose";
import {MONGOOSE_SCHEMA} from "../constants";
import {buildMongooseSchema} from "./buildMongooseSchema";

/**
 *
 * @param {Type<any>} target
 * @param {"mongoose".SchemaOptions} options
 * @returns {"mongoose".Schema}
 */
export function createSchema(target: Type<any>, options?: mongoose.SchemaOptions): mongoose.Schema {
  const store = Store.from(target);

  if (!store.has(MONGOOSE_SCHEMA)) {
    const definition: mongoose.SchemaDefinition = buildMongooseSchema(target);
    store.set(MONGOOSE_SCHEMA, new mongoose.Schema(definition, options));
  }

  return store.get(MONGOOSE_SCHEMA);
}
