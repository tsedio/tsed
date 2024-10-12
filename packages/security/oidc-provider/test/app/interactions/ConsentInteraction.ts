import {Inject} from "@tsed/di";
import {Name, Post, View} from "@tsed/schema";

import {Interaction, InteractionMethods, OidcCtx, OidcProvider, Prompt} from "../../../src/index.js";

@Interaction({
  name: "consent",
  requestable: true
})
@Name("Oidc")
export class ConsentInteraction implements InteractionMethods {
  @Inject()
  oidc: OidcProvider;

  @View("interaction")
  async $prompt(@OidcCtx() oidcCtx: OidcCtx): Promise<any> {
    const account = await oidcCtx.findAccount();
    return oidcCtx.interactionPrompt({
      title: "Authorize",
      account,
      flash: false
    });
  }

  @Post("/confirm")
  async confirm(@OidcCtx() oidcCtx: OidcCtx, @Prompt() prompt: Prompt) {
    oidcCtx.checkInteractionName("consent");

    const grant = await oidcCtx.getGrant();
    const details = prompt.details as {
      missingOIDCScope: string[];
      missingResourceScopes: Record<string, string[]>;
      missingOIDClaims: string[];
    };

    const {missingOIDCScope, missingOIDClaims, missingResourceScopes} = details;

    if (missingOIDCScope) {
      grant.addOIDCScope(missingOIDCScope.join(" "));
      // use grant.rejectOIDCScope to reject a subset or the whole thing
    }
    if (missingOIDClaims) {
      grant.addOIDCClaims(missingOIDCScope);
      // use grant.rejectOIDCClaims to reject a subset or the whole thing
    }

    if (missingResourceScopes) {
      for (const [indicator, scopes] of Object.entries(missingResourceScopes)) {
        grant.addResourceScope(indicator, scopes.join(" "));
        // use grant.rejectResourceScope to reject a subset or the whole thing
      }
    }

    const grantId = await grant.save();

    const consent: any = {};

    if (!oidcCtx.grantId) {
      // we don't have to pass grantId to consent, we're just modifying existing one
      consent.grantId = grantId;
    }

    return oidcCtx.interactionFinished({consent}, {mergeWithLastSubmission: true});
  }
}
