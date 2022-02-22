import {ancestorsOf, nameOf, Store, Type} from "@tsed/core";
import mongoose, {Connection, Model as MongooseModel} from "mongoose";
import {MONGOOSE_MODEL, MONGOOSE_MODEL_NAME, MONGOOSE_SCHEMA_OPTIONS} from "../constants/constants";
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
 * @param discriminatorValue
 * @returns {Model<T extends Document>}
 */
export function createModel<T>(
  target: any,
  schema: mongoose.Schema,
  name: string = nameOf(target),
  collection?: string,
  skipInit?: boolean,
  connection?: Connection,
  discriminatorValue?: string
) {
  // if ancestor has a discriminatorKey we need to link model with anscestor schema
  const ancestor = ancestorsOf(target).find((ancestor) => {
    const options = Store.from(ancestor).get(MONGOOSE_SCHEMA_OPTIONS) || {};
    return !!options.discriminatorKey;
  });

  if (ancestor && ancestor !== target) {
    const ancestorModel = Store.from(ancestor).get(MONGOOSE_MODEL) as MongooseModel<typeof target> | undefined;
    if (ancestorModel) {
      const discriminatorName = discriminatorValue || name;
      if (ancestorModel.discriminators && ancestorModel.discriminators[discriminatorName]) {
        return ancestorModel.discriminators[discriminatorName];
      } else {
        return ancestorModel.discriminator(discriminatorName, schema);
      }
    }
  }

  /* istanbul ignore else */
  if (connection) {
    const model = connection.model(name, schema, collection);
    Store.from(target).set(MONGOOSE_MODEL, model);
    return model;
  }

  const model = mongoose.model(name, schema, collection, skipInit);
  Store.from(target).set(MONGOOSE_MODEL, model);
  return model;
}
