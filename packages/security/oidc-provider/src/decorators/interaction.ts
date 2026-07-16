import {INTERACTION, INTERACTION_OPTIONS} from "../constants/constants.js";
import {StoreMerge, useDecorators} from "@tsed/core";
import {Controller} from "@tsed/di";
import {OidcInteractionOptions} from "../domain/OidcInteractionOptions.js";

/**
 * @Oidc
 */
export function Interaction(options: OidcInteractionOptions): ClassDecorator {
  return useDecorators(
    Controller({
      path: "/",
      subType: INTERACTION
    }),
    StoreMerge(INTERACTION_OPTIONS, options)
  );
}
