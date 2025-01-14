import {type IndexOptions, Schema, SchemaOptions} from "mongoose";

import {MongooseDocument} from "./MongooseDocument.js";

export type MongooseMethod =
  | "aggregate"
  | "bulkWrite"
  | "createCollection"
  | "save"
  | "insertMany"
  | "estimatedDocumentCount"
  | "countDocuments"
  | "deleteMany"
  | "distinct"
  | "find"
  | "findOne"
  | "findOneAndDelete"
  | "findOneAndReplace"
  | "findOneAndUpdate"
  | "replaceOne"
  | "updateMany"
  | "init"
  | "validate";

export type MongooseMethods = MongooseMethod | RegExp | MongooseMethod[];

export type MongooseNextCB = (err?: Error) => void;
export type MongooseHookOptions = Record<string, unknown>;
export type MongooseHookPromised<T = any> = (doc: T | MongooseDocument<T>) => Promise<void>;
export type MongoosePreHookCB<T = any> = (doc: T | MongooseDocument<T>, ...args: unknown[]) => Promise<void> | void;
export type MongoosePostHookCB<T = any> = (doc: T | MongooseDocument<T>, ...args: unknown[]) => Promise<void> | void;

export interface MongoosePreHook<T = any> {
  method: MongooseMethods;
  fn: MongoosePreHookCB<T>;
  options?: MongooseHookOptions;
}

export interface MongoosePostHook<T = any> {
  method: MongooseMethods;
  fn: MongoosePostHookCB<T>;
  options?: MongooseHookOptions;
}

export interface MongoosePluginOptions {
  plugin: (schema: Schema, options?: any) => void;
  options?: Record<string, unknown>;
}

export interface MongooseIndexOptions {
  fields: Record<any, any>;
  options?: IndexOptions;
}

export interface MongooseSchemaOptions {
  schemaOptions?: SchemaOptions;
  plugins?: MongoosePluginOptions[];
  indexes?: MongooseIndexOptions[];
  pre?: MongoosePreHook[];
  post?: MongoosePostHook[];
}
