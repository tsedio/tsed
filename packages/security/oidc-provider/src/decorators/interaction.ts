import {Controller} from "@tsed/common";
import {StoreMerge, useDecorators} from "@tsed/core";
import {INTERACTION, INTERACTION_OPTIONS} from "../constants/constants.js";
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
