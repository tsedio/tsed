import {nameOf, Store, Type} from "@tsed/core";
import mongoose, {Connection} from "mongoose";
import {MONGOOSE_MODEL_NAME} from "../constants";
import {MongooseModels} from "../registries/MongooseModels";
import {getSchemaToken} from "./createSchema";

export function getModelToken(target: Type<any>, options: any) {
  const {collectionName, token} = getSchemaToken(target, options);

  Store.from(target).set(MONGOOSE_MODEL_NAME, collectionName);
  MongooseModels.set(collectionName, target);

  return {token, collectionName};
}

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
