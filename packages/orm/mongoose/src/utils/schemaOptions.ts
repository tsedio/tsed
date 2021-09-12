import {cleanObject, deepMerge, Store} from "@tsed/core";
import {Schema} from "mongoose";
import {MONGOOSE_SCHEMA_OPTIONS} from "../constants";
import {MongooseNextCB, MongoosePostHook, MongoosePreHook, MongooseSchemaOptions} from "../interfaces";

/**
 * @ignore
 */
export function schemaOptions(target: any, options?: MongooseSchemaOptions) {
  const store = Store.from(target);

  if (!store.has(MONGOOSE_SCHEMA_OPTIONS)) {
    store.set(MONGOOSE_SCHEMA_OPTIONS, {});
  }

  if (options) {
    store.set(MONGOOSE_SCHEMA_OPTIONS, deepMerge(store.get(MONGOOSE_SCHEMA_OPTIONS), options));
  }

  return store.get(MONGOOSE_SCHEMA_OPTIONS);
}

function mapHookArgs(hook: MongoosePreHook | MongoosePostHook): [string | RegExp, Function] {
  return [hook.method, hook.options || hook.fn, hook.options ? hook.fn : undefined].filter(Boolean) as any;
}

/**
 * @ignore
 */
export function buildPreHook(fn: Function) {
  return fn.length === 2
    ? function (next: MongooseNextCB) {
        return fn(this, next);
      }
    : function (next: MongooseNextCB, options: any) {
        return fn(this, next, options);
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
    options.pre.forEach((item) => {
      item = {
        ...item,
        fn: buildPreHook(item.fn)
      };

      (schema.pre as any)(...mapHookArgs(item));
    });
  }

  if (options.post) {
    options.post.forEach((item) => (schema.post as any)(...mapHookArgs(item)));
  }
}
