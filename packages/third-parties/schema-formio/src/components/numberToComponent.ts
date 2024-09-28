import {cleanObject, getValue} from "@tsed/core";

import {execMapper, registerFormioMapper} from "../registries/FormioMappersContainer.js";

export function numberToComponent(schema: any, options: any) {
  const component = execMapper("default", schema, options);

  return cleanObject({
    ...component,
    input: true,
    delimiter: getValue(component, "delimiter", false),
    inputFormat: getValue(component, "inputFormat", "plain"),
    mask: getValue(component, "mask", false),
    requireDecimal: false,
    type: "number"
  });
}

registerFormioMapper("number", numberToComponent);
registerFormioMapper("integer", numberToComponent);
