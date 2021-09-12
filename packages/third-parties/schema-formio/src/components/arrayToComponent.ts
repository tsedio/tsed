import {cleanObject} from "@tsed/core";
import {execMapper, registerFormioMapper} from "../registries/FormioMappersContainer";
import {getRef} from "../utils/getRef";

export function arrayToComponent(schema: any, options: any) {
  schema = schema.items.$ref ? getRef(schema.items, options) : schema.items;

  const {type} = schema;

  switch (type) {
    case "object": // editgrid
      return execMapper("editgrid", schema, options);
    case "string": // tag or enum?
      if (schema.enum) {
        const component = execMapper("enum", schema, options);

        return {
          ...component,
          inline: false,
          type: "selectboxes"
        };
      }

      const component = execMapper(type, schema, options);

      return cleanObject({
        ...component,
        multiple: component.type === "tags" ? undefined : true
      });
    default:
    case "number":
      return {
        ...execMapper(type, schema, options),
        multiple: true
      };
  }
}

registerFormioMapper("array", arrayToComponent);
