/**
 *
 * @param out
 * @param obj
 * @param {{[p: string]: (collection: any[], value: any) => any}} reducers
 * @returns {any}
 */
import {classOf, isArrayOrArrayClass, isPrimitive, isPrimitiveOrPrimitiveClass} from "./ObjectUtils";

export function deepExtends(out: any, obj: any, reducers: {[key: string]: (collection: any[], value: any) => any} = {}): any {
  if (obj === undefined || obj === null) {
    return out;
  }

  if (isPrimitive(obj) || typeof obj === "symbol" || typeof obj === "function") {
    return obj;
  }

  if (isArrayOrArrayClass(obj)) {
    out = out || [];
  } else {
    out = out || (obj ? (classOf(obj) !== Object ? Object.create(obj) : {}) : {});
  }

  const defaultReducer = reducers["default"]
    ? reducers["default"]
    : (collection: any[], value: any) => {
        collection.indexOf(value) === -1 && collection.push(value);

        return collection;
      };
  const set = (key: string | number, value: any) => {
    if (isArrayOrArrayClass(obj)) {
      out.indexOf(value) === -1 && out.push(value);
    } else {
      out[key] = value;
    }
  };

  Object.keys(obj).forEach(key => {
    let value = obj[key];

    if (value === undefined || value === null) {
      return;
    }

    if (value === "" && out[key] !== "") {
      return;
    }

    if (isPrimitiveOrPrimitiveClass(value) || typeof value === "function") {
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
