import {deepExtends, Store} from "@tsed/core";
import {HookDoneFunction, HookNextFunction, Schema} from "mongoose";
import {MONGOOSE_SCHEMA_OPTIONS} from "../constants";
import {MongooseSchemaOptions} from "../interfaces";

/**
 * @ignore
 */
export function schemaOptions(target: any, options?: MongooseSchemaOptions) {
  const store = Store.from(target);

  if (!store.has(MONGOOSE_SCHEMA_OPTIONS)) {
    store.set(MONGOOSE_SCHEMA_OPTIONS, {});
  }

  if (options) {
    store.set(MONGOOSE_SCHEMA_OPTIONS, deepExtends(store.get(MONGOOSE_SCHEMA_OPTIONS), options));
  }

  return store.get(MONGOOSE_SCHEMA_OPTIONS);
}

/**
 * @ignore
 */
export function buildPreHook(fn: Function) {
  return fn.length === 2
    ? function (next: HookNextFunction) {
        return fn(this, next);
      }
    : function (next: HookNextFunction, done: HookDoneFunction) {
        return fn(this, next, done);
      };
}

/**
 * @ignore
 */
export function applySchemaOptions(schema: Schema, options: MongooseSchemaOptions) {
  if (options.plugins) {
    options.plugins.forEach((item) => schema.plugin(item.plugin, item.options));
  }

  if (options.indexes) {
    options.indexes.forEach((item) => schema.index(item.fields, item.options));
  }

  if (options.pre) {
    options.pre.forEach((item) => schema.pre(item.method, !!item.parallel, buildPreHook(item.fn), item.errorCb));
  }

  if (options.post) {
    options.post.forEach((item) => schema.post(item.method, item.fn as any));
  }
}
