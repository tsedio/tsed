import {useDecorators} from "@tsed/core";
import {Context} from "@tsed/platform-params";

import {INTERACTION_UID} from "../constants/constants.js";

export function Uid(): ParameterDecorator {
  return useDecorators(Context(INTERACTION_UID));
}

export type Uid = string;
