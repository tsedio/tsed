import {Context} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import {INTERACTION_UID} from "../constants/constants";

export function Uid(): ParameterDecorator {
  return useDecorators(Context(INTERACTION_UID));
}

export type Uid = string;
