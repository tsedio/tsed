import {execMapper, registerFormioMapper} from "../registries/FormioMappersContainer";
import {getRef} from "../utils/getRef";

export function anyToComponent(schema: any, options: any) {
  schema = getRef(schema, options);

  switch (schema.type) {
    case "object":
      if (!schema.properties && !schema.$ref) {
        return execMapper("map", schema, options);
      }

      return execMapper("nested", schema, options);
    case "array":
      return execMapper("array", schema, options);
    case "string":
      return execMapper("string", schema, options);
    case "boolean":
      return execMapper("boolean", schema, options);
    case "integer":
    case "number":
      return execMapper("number", schema, options);
  }

  return {};
}

registerFormioMapper("any", anyToComponent);
