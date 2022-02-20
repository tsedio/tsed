import {Controller} from "@tsed/common";
import {StoreMerge, useDecorators} from "@tsed/core";
import {INTERACTION, INTERACTION_OPTIONS} from "../constants/constants";
import {OidcInteractionOptions} from "../domain/OidcInteractionOptions";

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
