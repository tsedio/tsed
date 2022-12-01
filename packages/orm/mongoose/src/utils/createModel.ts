import {nameOf, Store, Type} from "@tsed/core";
import {JsonEntityStore} from "@tsed/schema";
import mongoose, {Connection} from "mongoose";
import {MONGOOSE_MODEL, MONGOOSE_MODEL_NAME} from "../constants/constants";
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
 * @param overwriteModels
 * @param connection
 * @param discriminatorValue
 * @returns {Model<T extends Document>}
 */
export function createModel<T>(
  target: any,
  schema: mongoose.Schema,
  name: string = nameOf(target),
  collection?: string,
  overwriteModels?: boolean,
  connection?: Connection
) {
  const entity = JsonEntityStore.from(target);

  if (entity.schema.isDiscriminator) {
    if (entity.ancestor) {
      const discriminatorName = entity.ancestor.schema.discriminator().getDefaultValue(target);
      const ancestorModel = entity.ancestor.get(MONGOOSE_MODEL);
      return ancestorModel.discriminator(discriminatorName, schema);
    }
  }

  const opts = overwriteModels ? {overwriteModels} : undefined;
  const c = connection || mongoose;

  const model = c.model(name, schema, collection, opts);
  Store.from(target).set(MONGOOSE_MODEL, model);

  return model;
}
