import {cleanObject} from "@tsed/core";

import {execMapper, registerFormioMapper} from "../registries/FormioMappersContainer.js";

export function enumToComponent(schema: any, options: any) {
  const component = execMapper("default", schema, options);
  const values = schema.enum.map((value: any) => {
    return {
      label: value,
      value
    };
  });

  if (component.type === "select") {
    return cleanObject({
      ...component,
      data: {
        json: component.data?.json || JSON.stringify(values)
      },
      dataSrc: "json",
      idPath: "value",
      valueProperty: "value",
      template: component.template || "<span>{{ item.label }}</span>"
    });
  }

  return cleanObject({
    ...component,
    values: schema["x-values"] || values.map((value: any) => ({...value, shortcut: ""}))
  });
}

registerFormioMapper("enum", enumToComponent);
