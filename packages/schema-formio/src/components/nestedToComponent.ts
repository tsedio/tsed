import {sentenceCase} from "change-case";
import {execMapper, registerFormioMapper} from "../registries/FormioMappersContainer";

export function nestedToComponent(schema: any, options: any) {
  return {
    ...execMapper("default", schema, options),
    label: undefined,
    tableView: false,
    type: "form",
    display: "form",
    input: true,
    components: [
      {
        key: "panel",
        label: options.parentKey && sentenceCase(options.parentKey),
        ...execMapper("panel", schema, options)
      }
    ]
  };
}

registerFormioMapper("nested", nestedToComponent);
