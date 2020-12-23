import {Context} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import {AnyObject} from "oidc-provider";
import {INTERACTION_PARAMS} from "../constants";

export function Params(expression?: string): ParameterDecorator {
  return useDecorators(Context([INTERACTION_PARAMS, expression].filter(Boolean).join(".")));
}

export type Params = AnyObject;
