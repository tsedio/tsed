import {Context} from "@tsed/common";
import {useDecorators} from "@tsed/core";
// @ts-ignore
import type {default as Provider} from "oidc-provider";
import {INTERACTION_SESSION} from "../constants/constants.js";

/**
 * @decorator
 */
export function OidcSession(expression?: string): ParameterDecorator {
  return useDecorators(Context([INTERACTION_SESSION, expression].filter(Boolean).join(".")));
}

export type OidcSession = InstanceType<Provider["Session"]>;
