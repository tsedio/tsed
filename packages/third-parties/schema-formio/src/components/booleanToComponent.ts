import {cleanObject} from "@tsed/core";

import {execMapper, registerFormioMapper} from "../registries/FormioMappersContainer.js";

function booleanToComponent(schema: any, options: any) {
  const component = execMapper("default", schema, options);

  return cleanObject({
    ...component,
    input: true,
    type: component.type || "checkbox"
  });
}

registerFormioMapper("boolean", booleanToComponent);
