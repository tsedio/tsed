import {Context} from "@tsed/platform-params";
import {INTERACTION_CONTEXT} from "../constants/constants.js";
import {OidcInteractionContext} from "../services/OidcInteractionContext.js";
import {useDecorators} from "@tsed/core";

export function OidcCtx(): ParameterDecorator {
  return useDecorators(Context(INTERACTION_CONTEXT));
}

export type OidcCtx = OidcInteractionContext;
