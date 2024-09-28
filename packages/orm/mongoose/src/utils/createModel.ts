import {nameOf, Store, Type} from "@tsed/core";
import {JsonEntityStore} from "@tsed/schema";
import mongoose, {Connection} from "mongoose";

import {MONGOOSE_MODEL, MONGOOSE_MODEL_NAME} from "../constants/constants.js";
import {MongooseModels} from "../registries/MongooseModels.js";
import {getSchemaToken} from "./createSchema.js";

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

  if (entity.isDiscriminatorChild) {
    const discriminatorName = entity.discriminatorAncestor!.schema.discriminator().getDefaultValue(target)!;
    const ancestorModel = entity.discriminatorAncestor!.get(MONGOOSE_MODEL);

    // check if discriminator is already registered on model before creating it
    return ancestorModel.discriminators?.[discriminatorName] || ancestorModel.discriminator(discriminatorName, schema);
  }

  const opts = overwriteModels ? {overwriteModels} : undefined;
  const c = connection || mongoose;

  const model = c.model(name, schema, collection, opts);
  Store.from(target).set(MONGOOSE_MODEL, model);

  return model;
}
