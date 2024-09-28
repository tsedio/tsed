import {useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/di";

import {PROVIDER_TYPE_TEMPORAL} from "../constants.js";

export function Temporal(): ClassDecorator {
  return useDecorators(
    Injectable({
      type: PROVIDER_TYPE_TEMPORAL
    })
  );
}
