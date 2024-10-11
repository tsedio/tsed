import {useDecorators} from "@tsed/core";
import {Context} from "@tsed/platform-params";
import type {default as Provider} from "oidc-provider";

import {INTERACTION_SESSION} from "../constants/constants.js";

/**
 * @decorator
 */
export function OidcSession(expression?: string): ParameterDecorator {
  return useDecorators(Context([INTERACTION_SESSION, expression].filter(Boolean).join(".")));
}

export type OidcSession = InstanceType<Provider["Session"]>;
