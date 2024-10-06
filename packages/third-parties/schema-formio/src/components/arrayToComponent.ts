import {cleanObject} from "@tsed/core";

import {execMapper, registerFormioMapper} from "../registries/FormioMappersContainer.js";
import {getRef} from "../utils/getRef.js";

export function arrayToComponent(schema: any, options: any) {
  const itemSchema = schema.items.$ref ? getRef(schema.items, options) : schema.items;

  const {type} = itemSchema;

  switch (type) {
    case "object": // editgrid
      return {
        ...execMapper("default", schema, options),
        ...execMapper("editgrid", itemSchema, options)
      };
    case "string": // tag or enum?
      if (itemSchema.enum) {
        const component = execMapper("enum", itemSchema, options);

        return {
          ...component,
          inline: false,
          type: "selectboxes"
        };
      }

      const component = execMapper(type, itemSchema, options);

      return cleanObject({
        ...component,
        multiple: component.type === "tags" ? undefined : true
      });
    default:
    case "number":
      return {
        ...execMapper(type, itemSchema, options),
        multiple: true
      };
  }
}

registerFormioMapper("array", arrayToComponent);
