import {createInstance} from "./createInstance";
import {isArrayOrArrayClass} from "./isArray";
import {isPrimitive} from "./isPrimitive";
import {objectKeys} from "./objectKeys";

export type DeepExtendsReducers = Record<string, (collection: any[], value: any) => any>;

function reducer() {
  return (collection: any[], value: any) => {
    collection.indexOf(value) === -1 && collection.push(value);

    return collection;
  };
}

/**
 * Deep extends a model with another one.
 * @param out
 * @param obj
 * @param reducers
 * @returns {any}
 * @deprecated Since 2021-07-16. Use deepMerge instead of
 */
export function deepExtends(out: any, obj: any, reducers: DeepExtendsReducers = {}): any {
  if (obj === undefined || obj === null) {
    return out;
  }

  if (isPrimitive(obj) || typeof obj === "symbol" || typeof obj === "function") {
    return obj;
  }

  if (isArrayOrArrayClass(obj)) {
    out = out || [];
  } else {
    out = out || createInstance(obj);
  }

  const defaultReducer = reducers["default"] ? reducers["default"] : reducer();

  const set = (key: string | number, value: any) => {
    if (isArrayOrArrayClass(obj)) {
      out.indexOf(value) === -1 && out.push(value);
    } else {
      out[key] = value;
    }
  };

  objectKeys(obj).forEach((key) => {
    let value = obj[key];

    // istanbul ignore next
    if (value === undefined || value === null) {
      return;
    }

    // istanbul ignore next
    if (value === "" && out[key] !== "") {
      return;
    }

    if (isPrimitive(value) || typeof value === "function") {
      set(key, value);

      return;
    }

    if (isArrayOrArrayClass(value)) {
      value = value.map((value: any) => deepExtends(undefined, value));

      set(
        key,
        []
          .concat(out[key] || [], value)
          .reduce(
            (collection: any[], value: any) => (reducers[key] ? reducers[key](collection, value) : defaultReducer(collection, value)),
            []
          )
      );

      return;
    }

    // Object
    if (isArrayOrArrayClass(obj)) {
      set(key, deepExtends(undefined, value, reducers));
    } else {
      set(key, deepExtends(out[key], value, reducers));
    }
  });

  if (isArrayOrArrayClass(out)) {
    out.reduce((collection: any[], value: any) => defaultReducer(collection, value), []);
  }

  return out;
}
