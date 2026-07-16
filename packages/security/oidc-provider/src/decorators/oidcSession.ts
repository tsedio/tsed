import {Context} from "@tsed/platform-params";
import {INTERACTION_SESSION} from "../constants/constants.js";
import type {default as Provider} from "oidc-provider";
import {useDecorators} from "@tsed/core";

/**
 * @decorator
 */
export function OidcSession(expression?: string): ParameterDecorator {
  return useDecorators(Context([INTERACTION_SESSION, expression].filter(Boolean).join(".")));
}

export type OidcSession = InstanceType<Provider["Session"]>;
