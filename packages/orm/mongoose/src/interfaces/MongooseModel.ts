import {Document, Model} from "mongoose";

// TODO since v5.11.5 Model require Document with id, See issue https://github.com/Automattic/mongoose/issues/9684
export type MongooseMergedDocument<T> = {[K in keyof T]: T[K]};

export interface MongooseDocumentMethods<T> {
  toClass(): T;
}

export type MongooseModel<T> = Model<MongooseMergedDocument<Document & T & MongooseDocumentMethods<T>>>;
