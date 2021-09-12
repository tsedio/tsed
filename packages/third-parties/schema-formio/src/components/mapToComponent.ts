import {execMapper, registerFormioMapper} from "../registries/FormioMappersContainer";

export function mapToComponent(schema: any, options: any) {
  return {
    ...execMapper("default", schema, options),
    type: "datamap",
    tableView: false,
    input: true,
    valueComponent: {
      ...execMapper("any", schema.additionalProperties, options),
      hideLabel: true,
      tableView: true
    }
  };
}

registerFormioMapper("map", mapToComponent);
