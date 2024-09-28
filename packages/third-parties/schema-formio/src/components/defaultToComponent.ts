import {cleanObject} from "@tsed/core";

import {registerFormioMapper} from "../registries/FormioMappersContainer.js";
import {getFormioProps} from "../utils/getFormioProps.js";

export function defaultToComponent(schema: any, options: any): any {
  const formioProps = getFormioProps(schema);

  return cleanObject({
    ...formioProps,
    disabled: !!schema.readOnly,
    description: schema.description,
    defaultValue: schema.default
  });
}

registerFormioMapper("default", defaultToComponent);
