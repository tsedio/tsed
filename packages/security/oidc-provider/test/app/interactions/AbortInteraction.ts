import {Inject} from "@tsed/di";
import {View} from "@tsed/platform-views";
import {Name} from "@tsed/schema";

import {Interaction, InteractionMethods, OidcCtx, OidcProvider} from "../../../src/index.js";

@Interaction({
  name: "abort"
})
@Name("Oidc")
export class AbortInteraction implements InteractionMethods {
  @Inject()
  oidc: OidcProvider;

  @View("interaction")
  $prompt(@OidcCtx() oidcCtx: OidcCtx): Promise<any> {
    return oidcCtx.interactionFinished(
      {
        error: "access_denied",
        error_description: "End-User aborted interaction"
      },
      {
        mergeWithLastSubmission: false
      }
    );
  }
}
