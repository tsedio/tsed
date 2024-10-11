import {useDecorators} from "@tsed/core";
import {Context} from "@tsed/platform-params";

import {INTERACTION_PARAMS} from "../constants/constants.js";

export function Params(expression?: string): ParameterDecorator {
  return useDecorators(Context([INTERACTION_PARAMS, expression].filter(Boolean).join(".")));
}

export type Params = Record<string, any>;
