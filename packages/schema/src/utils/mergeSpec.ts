import {cleanObject, deepExtends} from "@tsed/core";
import {OpenSpec2, OpenSpec3} from "@tsed/openspec";

/**
 * @ignore
 */
export const defaultReducer = (collection: any[], value: any) => {
  if (collection.indexOf(value) === -1) {
    collection.push(value);
  }

  return collection;
};

/**
 * @ignore
 */
export const schemesReducer = (collection: any[], value: any) => {
  const current = collection.find(
    (current) => (current.type && current.type === value.type) || (current.$ref && current.$ref === value.$ref)
  );

  if (current) {
    deepExtends(current, value);
  } else {
    collection.push(value);
  }

  return collection;
};

/**
 * @ignore
 */
export const parameters = (collection: any[], value: any) => {
  const current = collection.find((current) => current.in === value.in && current.name === value.name);

  if (current) {
    deepExtends(current, value);
  } else {
    collection.push(value);
  }

  return collection;
};

/**
 * @ignore
 */
export const security = (collection: any[], value: any) => {
  const current = collection.find((current: any): any => {
    return Object.keys(value).find((key) => !!current[key]);
  });

  if (current) {
    deepExtends(current, value, {default: defaultReducer});
  } else {
    collection.push(value);
  }

  return collection;
};

/**
 * @ignore
 */
export const tagsReducer = (collection: any[], value: any) => {
  const current = collection.find((current) => current.name === value.name);

  if (current) {
    deepExtends(current, value);
  } else {
    collection.push(value);
  }

  return collection;
};

/**
 * @ignore
 */
const SPEC_REDUCERS = {
  default: defaultReducer,
  security,
  parameters,
  oneOf: schemesReducer,
  anyOf: schemesReducer,
  allOf: schemesReducer,
  tags: tagsReducer
};

/**
 * Merge two spec
 * @param spec
 * @param input
 */
export function mergeSpec<Spec = OpenSpec2 | OpenSpec3>(spec: Partial<Spec>, input: Partial<Spec>): Partial<Spec> {
  return cleanObject(deepExtends(spec, input, SPEC_REDUCERS));
}
