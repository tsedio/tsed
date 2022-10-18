import {Inject, Post} from "@tsed/common";
import {Interaction, OidcCtx, OidcProvider, Prompt} from "@tsed/oidc-provider";
import {Name} from "@tsed/schema";
import {View} from "@tsed/platform-views";

@Interaction({
  name: "abort"
})
@Name("Oidc")
export class AbortInteraction {
  @Inject()
  oidc: OidcProvider;

  @View("interaction")
  async $prompt(@OidcCtx() oidcCtx: OidcCtx): Promise<any> {
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
