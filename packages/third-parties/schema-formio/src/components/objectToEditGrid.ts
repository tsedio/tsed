import {execMapper, registerFormioMapper} from "../registries/FormioMappersContainer.js";

export function objectToEditGrid(schema: any, options: any) {
  return {
    ...execMapper("default", schema, options),
    rowDrafts: false,
    type: "editgrid",
    input: true,
    components: execMapper("properties", schema, options)
  };
}

registerFormioMapper("editgrid", objectToEditGrid);
