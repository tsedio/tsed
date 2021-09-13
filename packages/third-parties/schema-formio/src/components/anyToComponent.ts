import {execMapper, registerFormioMapper} from "../registries/FormioMappersContainer";
import {getRef} from "../utils/getRef";

export function anyToComponent(schema: any, options: any) {
  schema = getRef(schema, options);

  switch (schema.type) {
    case "object":
      if (schema.additionalProperties) {
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
    // default:
    //   return execMapper("default", schema, options);
  }
}

registerFormioMapper("any", anyToComponent);
