import {cleanObject} from "@tsed/core";
import {sentenceCase} from "change-case";
import {execMapper, registerFormioMapper} from "../registries/FormioMappersContainer";

export function enumToComponent(schema: any, options: any) {
  const component = execMapper("default", schema, options);

  return cleanObject({
    ...component,
    values:
      schema["x-values"] ||
      schema.enum.map((value: any) => {
        return {
          label: sentenceCase(value),
          shortcut: "",
          value
        };
      })
  });
}

registerFormioMapper("enum", enumToComponent);
