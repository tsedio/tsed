import {Context} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import {INTERACTION_GRANT_ID, INTERACTION_PARAMS} from "../constants/constants";

export function GrantId(): ParameterDecorator {
  return useDecorators(Context(INTERACTION_GRANT_ID));
}

export type GrantId = string;
