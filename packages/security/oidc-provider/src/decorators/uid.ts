import {Context} from "@tsed/platform-params";
import {INTERACTION_UID} from "../constants/constants.js";
import {useDecorators} from "@tsed/core";

export function Uid(): ParameterDecorator {
  return useDecorators(Context(INTERACTION_UID));
}

export type Uid = string;
