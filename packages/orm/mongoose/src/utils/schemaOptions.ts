import {deepMerge, Store} from "@tsed/core";
import {Schema} from "mongoose";

import {MONGOOSE_SCHEMA_OPTIONS} from "../constants/constants.js";
import {
  MongooseHookPromised,
  MongooseNextCB,
  MongoosePostHook,
  MongoosePreHook,
  MongoosePreHookCB,
  MongooseSchemaOptions
} from "../interfaces/MongooseSchemaOptions.js";

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
export function buildPreHook(fn: MongoosePreHookCB) {
  return fn.length === 1
    ? function () {
        return (fn as MongooseHookPromised)(this);
      }
    : function (next: MongooseNextCB) {
        return fn(this, next);
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
