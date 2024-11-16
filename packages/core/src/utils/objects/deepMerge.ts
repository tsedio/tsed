import {createInstance} from "./createInstance.js";
import {isFunction} from "./isFunction.js";
import {isPrimitive} from "./isPrimitive.js";
import {isSymbol} from "./isSymbol.js";
import {objectKeys} from "./objectKeys.js";

export type DeepMergeReducerCB = (collection: any[], value: any, options?: DeepMergeOptions) => any;
export type DeepMergeComparatorCB = (item: any, ref: any) => boolean;

export interface DeepMergeOptions {
  reducers?: Record<string, DeepMergeReducerCB>;
  parentKey?: string;
  cleanUndefinedProps?: boolean;
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

function getReducer({reducers, parentKey}: DeepMergeOptions) {
  if (!reducers) {
    return defaultReducer;
  }

  if (parentKey && reducers[parentKey]) {
    return reducers[parentKey];
  }

  return reducers["default"] || defaultReducer;
}

function shouldReturnObj(obj: any, source: any) {
  return isPrimitive(obj) || isSymbol(obj) || isFunction(obj) || source === undefined;
}

function shouldReturnSource(obj: any, source: any) {
  return obj === undefined || obj === null || (obj === "" && source !== "");
}

export function deepMerge<T = any, C = any>(source: T & any, obj: C & any, options: DeepMergeOptions = {}): (T & C) | undefined | null {
  if (shouldReturnSource(obj, source)) {
    return source as any;
  }

  if (shouldReturnObj(obj, source)) {
    return obj;
  }

  if (Array.isArray(source)) {
    const reducer = getReducer(options);

    return [].concat(obj).reduce((out: any[], value: any) => reducer(out, value, options), [...source]);
  }

  const newObj = createInstance(source);

  return [...objectKeys(source), ...objectKeys(obj)].reduce((out: any, key: string) => {
    const src = source && source[key];
    const value = deepMerge(src, obj && obj[key], {
      ...options,
      parentKey: key
    });

    if (options.cleanUndefinedProps && value === undefined) {
      return out;
    }

    out[key] = value;

    return out;
  }, newObj);
}
