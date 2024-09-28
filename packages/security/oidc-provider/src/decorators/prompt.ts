import {Context} from "@tsed/common";
import {useDecorators} from "@tsed/core";
// @ts-ignore
import type {PromptDetail as P} from "oidc-provider";

import {INTERACTION_PROMPT} from "../constants/constants.js";

export function Prompt(): ParameterDecorator {
  return useDecorators(Context(INTERACTION_PROMPT));
}

export type Prompt = P;
