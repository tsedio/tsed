import {createInstance} from "./createInstance.js";
import {objectKeys} from "./objectKeys.js";

/**
 * Callback type for custom array merge reducers.
 * @public
 * @since v7.0.0
 */
export type DeepMergeReducerCB = (collection: any[], value: any, options?: DeepMergeOptions) => any;

/**
 * Callback type for comparing array items during merge.
 * @public
 * @since v7.0.0
 */
export type DeepMergeComparatorCB = (item: any, ref: any) => boolean;

/**
 * Configuration options for deep merge operations.
 * @public
 * @since v7.0.0
 */
export interface DeepMergeOptions {
  reducers?: Record<string, DeepMergeReducerCB>;
  parentKey?: string;
  cleanUndefinedProps?: boolean;
  alter?: (key: string, value: any) => any;
}

/**
 * Creates a merge reducer using a custom comparator function.
 *
 * @public
 * @since v7.0.0
 */
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

const hasEnumerableOwn = Object.prototype.propertyIsEnumerable;

/**
 * Same result as `mergeReducerBuilder((a, b) => a === b)`, but appends in place:
 * `merge()` gives it its own copy of the source array.
 */
function defaultInPlaceReducer(collection: any[], value: any, options: DeepMergeOptions) {
  const index = collection.indexOf(value);

  if (index === -1) {
    collection.push(value);
  } else {
    collection[index] = deepMerge(collection[index], value, options);
  }

  return collection;
}

function getReducer(reducers: DeepMergeOptions["reducers"], parentKey: string | undefined) {
  if (!reducers) {
    return defaultInPlaceReducer;
  }

  if (parentKey && reducers[parentKey]) {
    return reducers[parentKey];
  }

  return reducers["default"] || defaultInPlaceReducer;
}

function shouldReturnObj(obj: any, source: any) {
  // inline typeof checks: this runs for every merged value
  const type = typeof obj;

  return (
    type === "string" ||
    type === "number" ||
    type === "boolean" ||
    type === "symbol" ||
    type === "function" ||
    obj instanceof Boolean ||
    source === undefined
  );
}

function shouldReturnSource(obj: any, source: any) {
  return obj === undefined || obj === null || (obj === "" && source !== "");
}

/**
 * Deeply merges two values, combining objects recursively and handling arrays with custom reducers.
 *
 * Supports primitives, arrays, and objects. Can clean undefined properties and apply custom transformations.
 *
 * @public
 * @since v7.0.0
 * @see DeepMergeOptions
 */
export function deepMerge<T = any, C = any>(source: T & any, obj: C & any, options: DeepMergeOptions = {}): (T & C) | undefined | null {
  return merge(source, obj, options, options.parentKey);
}

/**
 * `options` stays the user object for the whole merge; the nested key travels as `parentKey`,
 * and the `{...options, parentKey}` copy is only built when a reducer receives it.
 */
function merge(source: any, obj: any, options: DeepMergeOptions, parentKey: string | undefined): any {
  if (shouldReturnSource(obj, source)) {
    return source;
  }

  if (shouldReturnObj(obj, source)) {
    return obj;
  }

  if (Array.isArray(source)) {
    const reducer = getReducer(options.reducers, parentKey);
    const reducerOptions = parentKey === options.parentKey ? options : {...options, parentKey};

    return [].concat(obj).reduce((out: any[], value: any) => reducer(out, value, reducerOptions), [...source]);
  }

  const out = createInstance(source);
  const sourceKeys = objectKeys(source);
  const objKeys = objectKeys(obj);

  for (let i = 0; i < sourceKeys.length; i++) {
    mergeKey(out, source, obj, sourceKeys[i], options);
  }

  for (let i = 0; i < objKeys.length; i++) {
    const key = objKeys[i];

    // keys of both objects were already merged with the source keys
    if (!hasEnumerableOwn.call(source, key)) {
      mergeKey(out, source, obj, key, options);
    }
  }

  return out;
}

function mergeKey(out: any, source: any, obj: any, key: string, options: DeepMergeOptions) {
  const value = merge(source && source[key], obj && obj[key], options, key);

  if (options.cleanUndefinedProps && value === undefined) {
    return;
  }

  out[key] = options.alter?.(key, value) ?? value;
}
