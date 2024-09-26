import {Context} from "@tsed/common";
import {useDecorators} from "@tsed/core";

import {INTERACTION_CONTEXT} from "../constants/constants.js";
import type {OidcInteractionContext} from "../services/OidcInteractionContext.js";

export function OidcCtx(): ParameterDecorator {
  return useDecorators(Context(INTERACTION_CONTEXT));
}

export type OidcCtx = OidcInteractionContext;
