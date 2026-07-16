import {Context} from "@tsed/platform-params";
import {INTERACTION_PROMPT} from "../constants/constants.js";
import type {PromptDetail as P} from "oidc-provider";
import {useDecorators} from "@tsed/core";

export function Prompt(): ParameterDecorator {
  return useDecorators(Context(INTERACTION_PROMPT));
}

export type Prompt = P;
