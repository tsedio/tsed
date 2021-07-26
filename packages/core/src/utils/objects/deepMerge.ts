import {createInstance} from "./createInstance";
import {isArray} from "./isArray";
import {isFunction} from "./isFunction";
import {isPrimitive} from "./isPrimitive";
import {isSymbol} from "./isSymbol";
import {objectKeys} from "./objectKeys";

export type DeepMergeReducerCB = (collection: any[], value: any, options?: DeepMergeOptions) => any;
export type DeepMergeComparatorCB = (item: any, ref: any) => boolean;

export interface DeepMergeOptions {
  reducers?: Record<string, DeepMergeReducerCB>;
  parentKey?: string;
}

export function mergeReducerBuilder(cb: DeepMergeComparatorCB) {
  return (collection: any[], value: any, options: DeepMergeOptions) => {
    const index = collection.findIndex((item) => cb(item, value));

    if (index === -1) {
      return [...collection, value];
    }

    collection[index] = deepMerge(collection[index], value, options);

    return collection;
  };
}

const defaultReducer = mergeReducerBuilder((a, b) => a === b);

function getReducer(options: DeepMergeOptions) {
  if (!options.reducers) {
    return defaultReducer;
  }

  if (options.parentKey && options.reducers[options.parentKey]) {
    return options.reducers[options.parentKey];
  }

  return options.reducers["default"] || defaultReducer;
}

export function deepMerge<T extends any = any, C extends any = any>(
  source: T & any,
  obj: C & any,
  options: DeepMergeOptions = {}
): (T & C) | undefined | null {
  if (obj === undefined || obj === null || (obj === "" && source !== "")) {
    return source as any;
  }

  if (isPrimitive(obj) || isSymbol(obj) || isFunction(obj) || source === undefined) {
    return obj;
  }

  if (isArray(source)) {
    const reducer = getReducer(options);
    const collection = [...source];

    return [].concat(obj).reduce((out: any[], value: any) => {
      return reducer([...out], value, {...options});
    }, collection);
  }

  return [...objectKeys(source), ...objectKeys(obj)].reduce((out: any, key: string) => {
    const src = source && source[key];
    const value = obj && obj[key];

    return {
      ...out,
      [key]: deepMerge(src, value, {
        ...options,
        parentKey: key
      })
    };
  }, createInstance(source));
}
