import {JsonDeserializerOptions} from "@tsed/json-mapper";
import {Document, Model} from "mongoose";

// TODO since v5.11.5 Model require Document with id, See issue https://github.com/Automattic/mongoose/issues/9684
export type MongooseMergedDocument<T> = {[K in keyof T]: T[K]};

export interface MongooseDocumentMethods<T> {
  toClass(options?: JsonDeserializerOptions): T;
}

export interface MongooseModel<T> extends Model<MongooseMergedDocument<Document & T & MongooseDocumentMethods<T>>> {}
