import {getValue} from "@tsed/core";

export function getRef(schema: any, options: any) {
  if (schema.$ref) {
    return getValue(options, schema.$ref.replace("#/", "").replace(/\//g, "."));
  }
  return schema;
}
