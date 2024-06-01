import {execMapper, registerFormioMapper} from "../registries/FormioMappersContainer.js";

export function panelToComponent(schema: any, options: any) {
  return {
    ...execMapper("default", schema, options),
    collapsible: false,
    input: false,
    tableView: false,
    components: execMapper("properties", schema, options)
  };
}

registerFormioMapper("panel", panelToComponent);
