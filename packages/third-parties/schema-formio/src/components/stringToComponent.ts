import {cleanObject} from "@tsed/core";

import {execMapper, registerFormioMapper} from "../registries/FormioMappersContainer.js";

export function stringToComponent(schema: any, options: any) {
  if (schema.format) {
    const component = execMapper("default", schema, options);
    switch (schema.format) {
      case "date":
      case "date-time":
        return execMapper("date", schema, options);
      case "uri":
        return cleanObject({
          input: true,
          ...component,
          type: component.type || "url"
        });
      default:
        return cleanObject({
          input: true,
          ...component,
          type: component.type || schema.format
        });
    }
  }

  if (schema.enum) {
    const component = execMapper("enum", schema, options);

    return {
      ...component,
      type: component.type || "radio"
    };
  }

  const component = execMapper("default", schema, options);
  return cleanObject({
    input: true,
    type: component.type || "textfield",
    ...component
  });
}

registerFormioMapper("string", stringToComponent);
