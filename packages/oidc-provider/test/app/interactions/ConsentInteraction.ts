import {Post, View} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";
import {Interaction, OidcCtx, OidcSession, Params, Prompt, Uid} from "@tsed/oidc-provider";
import {Name} from "@tsed/schema";

@Interaction({
  name: "consent"
})
@Name("Oidc")
export class ConsentInteraction {
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

    const result: any = {
      consent: {
        // any scopes you do not wish to grant go in here
        //   otherwise details.scopes.new.concat(details.scopes.accepted) will be granted
        rejectedScopes: [],

        // any claims you do not wish to grant go in here
        //   otherwise all claims mapped to granted scopes
        //   and details.claims.new.concat(details.claims.accepted) will be granted
        rejectedClaims: [],

        // replace = false means previously rejected scopes and claims remain rejected
        // changing this to true will remove those rejections in favour of just what you rejected above
        replace: false
      }
    };

    return oidcCtx.interactionFinished(result, {mergeWithLastSubmission: true});
  }
}