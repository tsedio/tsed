import {nameOf} from "@tsed/core";
import mongoose from "mongoose";
import {Connection} from "mongoose";

/**
 * Create an instance of mongoose.model from a class.
 *
 * @param {Type<any>} target Class attached to the schema and model.
 * @param {"mongoose".Schema} schema Schema that will be attached to the model.
 * @param name model name
 * @param collection (optional, induced from model name)
 * @param skipInit whether to skip initialization (defaults to false)
 * @param connection
 * @returns {Model<T extends Document>}
 */
export function createModel<T>(
  target: any,
  schema: mongoose.Schema,
  name: string = nameOf(target),
  collection?: string,
  skipInit?: boolean,
  connection?: Connection
) {
  /* istanbul ignore else */
  if (connection) {
    return connection.model(name, schema, collection);
  }

  return mongoose.model(name, schema, collection, skipInit);
}
