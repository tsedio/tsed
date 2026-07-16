import {INTERACTION_GRANT_ID, INTERACTION_PARAMS} from "../constants/constants.js";
import {Context} from "@tsed/platform-params";
import {useDecorators} from "@tsed/core";

export function GrantId(): ParameterDecorator {
  return useDecorators(Context(INTERACTION_GRANT_ID));
}

export type GrantId = string;
