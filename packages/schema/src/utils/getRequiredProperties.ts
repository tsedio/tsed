import {uniq} from "@tsed/core";

/**
 * @ignore
 */
export function getRequiredProperties(obj: any, schema: any, useAlias: boolean) {
  let required = obj.required || [];

  required = [...required, ...schema.$required];

  if (schema.get("properties")) {
    required = Object.entries(schema.get("properties")).reduce((required, [key, prop]: [string, any]) => {
      if (prop.$selfRequired !== undefined) {
        return prop.$selfRequired ? required.concat(key) : required.filter(key);
      }

      return required;
    }, required);
  }

  if (required.length) {
    required = uniq(required).map((key) => (useAlias ? (schema.alias.get(key) as string) || key : key));
    return {
      ...obj,
      required
    };
  }

  return obj;
}
