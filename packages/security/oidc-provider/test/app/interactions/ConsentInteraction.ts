import {Inject, Post} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";
import {Interaction, OidcCtx, OidcProvider, OidcSession, Params, Prompt, Uid} from "@tsed/oidc-provider";
import {Name} from "@tsed/schema";
import {View} from "@tsed/platform-views";

@Interaction({
  name: "consent"
})
@Name("Oidc")
export class ConsentInteraction {
  @Inject()
  oidc: OidcProvider;

  @View("interaction")
  async $prompt(@OidcCtx() oidcCtx: OidcCtx,
                @Prompt() prompt: Prompt,
                @OidcSession() session: OidcSession,
                @Params() params: Params,
                @Uid() uid: Uid): Promise<any> {
    const client = await oidcCtx.findClient();

    return {
      client,
      uid,
      details: prompt.details,
      params,
      title: "Authorize",
      ...oidcCtx.debug()
    };
  }

  @Post("/confirm")
  async confirm(@OidcCtx() oidcCtx: OidcCtx, @Prompt() prompt: Prompt) {
    if (prompt.name !== "consent") {
      throw new BadRequest("Bad interaction name");
    }

    const grant = await oidcCtx.getGrant();
    const details = prompt.details as {
      missingOIDCScope: string[],
      missingResourceScopes: Record<string, string[]>,
      missingOIDClaims: string[]
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
      // eslint-disable-next-line no-restricted-syntax
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
