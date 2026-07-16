import {Interaction, InteractionMethods, OidcCtx, OidcProvider} from "../../../src/index.js";
import {Inject} from "@tsed/di";
import {Name} from "@tsed/schema";
import {View} from "@tsed/platform-views";

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
