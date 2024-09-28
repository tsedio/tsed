import {deepMerge, mergeReducerBuilder} from "@tsed/core";
import {OpenSpec2, OpenSpec3} from "@tsed/openspec";

/**
 * @ignore
 */
export const schemesReducer = mergeReducerBuilder((current, value) => {
  if (current.type && current.type && current.type === value.type && value.type === "array") {
    return JSON.stringify(current.items) === JSON.stringify(value.items);
  }

  return (current.type && current.type === value.type) || (current.$ref && current.$ref === value.$ref);
});

/**
 * @ignore
 */
export const parameters = mergeReducerBuilder((current, value) => current.in === value.in && current.name === value.name);

/**
 * @ignore
 */
export const security = mergeReducerBuilder((current, value) => {
  return !!Object.keys(value).find((key) => !!current[key]);
});

/**
 * @ignore
 */
export const tagsReducer = mergeReducerBuilder((current, value) => current.name === value.name);

/**
 * @ignore
 */
const SPEC_REDUCERS = {
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
  return deepMerge(spec, input, {
    reducers: SPEC_REDUCERS,
    cleanUndefinedProps: true
  });
}
