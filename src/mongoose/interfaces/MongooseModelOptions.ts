import {HookDoneFunction, HookErrorCallback, HookNextFunction, NativeError, Schema, SchemaOptions} from "mongoose";
import {MongooseDocument} from "./MongooseDocument";

/**
 *
 */
export interface MongoosePreHookAsyncCB<T> {
    (doc: MongooseDocument<T>, next: HookNextFunction, done: HookDoneFunction): any;
}

export interface MongoosePreHookSyncCB<T> {
    (doc: MongooseDocument<T>, next: HookNextFunction): any;
}

/**
 *
 */
export interface MongoosePostErrorHookCB<T> {
    (error: any, doc: MongooseDocument<T>, next: (err?: NativeError) => void): void;
}

/**
 *
 */
export interface MongoosePostHookCB<T> {
    (doc: MongooseDocument<T>, next: (err?: NativeError) => void): void;
}

/**
 *
 */
export interface MongoosePreHook {
    method: string;
    fn: MongoosePreHookSyncCB<any> | MongoosePreHookAsyncCB<any>;
    parallel?: boolean;
    errorCb?: HookErrorCallback;
}

/**
 *
 */
export interface MongoosePostHook {
    method: string;
    fn: MongoosePostHookCB<any> | MongoosePostErrorHookCB<any>;
}

/**
 *
 */
export interface MongoosePluginOptions {
    plugin: (schema: Schema, options?: any) => void;
    options?: any;
}

/**
 *
 */
export interface MongooseModelOptions {
    schemaOptions?: SchemaOptions;
    name?: string;
    collection?: string;
    skipInit?: boolean;
    plugins?: MongoosePluginOptions[];
    pre?: MongoosePreHook[];
    post?: MongoosePostHook[];
}
