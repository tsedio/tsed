import {nameOf, Store} from "@tsed/core";
import * as mongoose from "mongoose";
import {MONGOOSE_MODEL_NAME} from "../constants";
import {MongooseModel} from "../interfaces";

/**
 * Create an instance of mongoose.model from a class.
 *
 * @param {Type<any>} target Class attached to the schema and model.
 * @param {"mongoose".Schema} schema Schema that will be attached to the model.
 * @param name model name
 * @param collection (optional, induced from model name)
 * @param skipInit whether to skip initialization (defaults to false)
 * @returns {Model<T extends Document>}
 */
export function createModel<T>(
  target: any,
  schema: mongoose.Schema,
  name: string = nameOf(target),
  collection?: string,
  skipInit?: boolean
): MongooseModel<T> {
  Store.from(target).set(MONGOOSE_MODEL_NAME, name);

  return mongoose.model(name, schema, collection, skipInit);
}
