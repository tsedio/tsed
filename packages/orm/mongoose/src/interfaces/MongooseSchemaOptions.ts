import {NativeError, Schema, SchemaOptions} from "mongoose";
import {MongooseDocument} from "./MongooseDocument";

export type MongooseNextCB = (err?: NativeError) => void;

export interface MongooseHookOptions {
  document?: boolean;
  query?: boolean;
  parallel?: boolean;
}

export type MongoosePreHookCB<T = any> =
  | ((doc: T | MongooseDocument<T>, next: MongooseNextCB) => void)
  | ((doc: T | MongooseDocument<T>) => Promise<void> | void);

export type MongoosePostHookCB<T = any> =
  | ((doc: T | MongooseDocument<T>, error: NativeError, next: MongooseNextCB) => void)
  | ((doc: T | MongooseDocument<T>, error: NativeError) => Promise<void> | void)
  | ((doc: T | MongooseDocument<T>, next: MongooseNextCB) => void)
  | ((doc: T | MongooseDocument<T>) => Promise<void> | void);

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
  fields: object;
  options?: Record<string, unknown>;
}

export interface MongooseSchemaOptions {
  schemaOptions?: SchemaOptions;
  plugins?: MongoosePluginOptions[];
  indexes?: MongooseIndexOptions[];
  pre?: MongoosePreHook[];
  post?: MongoosePostHook[];
}
