import {type IndexOptions, Schema, SchemaOptions} from "mongoose";

import {MongooseDocument} from "./MongooseDocument.js";

export type MongooseNextCB = (err?: Error) => void;

export interface MongooseHookOptions {
  document?: boolean;
  query?: boolean;
  parallel?: boolean;
}

export type MongooseHookPromised<T = any> = (doc: T | MongooseDocument<T>) => Promise<void> | void;

export type MongoosePreHookCB<T = any> = ((doc: T | MongooseDocument<T>, next: MongooseNextCB) => void) | MongooseHookPromised;

export type MongoosePostHookCB<T = any> =
  | ((doc: T | MongooseDocument<T>, error: Error, next: MongooseNextCB) => void)
  | ((doc: T | MongooseDocument<T>, error: Error) => Promise<void> | void)
  | ((doc: T | MongooseDocument<T>, next: MongooseNextCB) => void)
  | MongooseHookPromised;

export interface MongoosePreHook<T = any> {
  method: string | RegExp;
  fn: MongoosePreHookCB<T>;
  options?: MongooseHookOptions;
}

export interface MongoosePostHook<T = any> {
  method: string | RegExp;
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
