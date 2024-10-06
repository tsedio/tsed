import {Env} from "@tsed/core";
import {Constant} from "@tsed/di";
import {Name, View} from "@tsed/schema";
import {interactionPolicy, KoaContextWithOIDC} from "oidc-provider";

import {Interaction, InteractionMethods, OidcCtx, OidcSession, Params, Prompt, Uid} from "../../../src/index.js";
import Check = interactionPolicy.Check;

@Interaction({
  name: "custom",
  requestable: true
})
@Name("Oidc")
export class CustomInteraction implements InteractionMethods {
  @Constant("env")
  env: Env;

  $onCreate() {}

  /**
   * return checks conditions. See: https://github.com/panva/node-oidc-provider/blob/main/docs/README.md#interactionspolicy
   */
  checks() {
    return [
      new Check("no_session", "End-User authentication is required", (ctx) => {
        const {oidc} = ctx;

        if (oidc.session?.accountId) {
          // @ts-ignore
          return Check.NO_NEED_TO_PROMPT;
        }

        // @ts-ignore
        return Check.REQUEST_PROMPT;
      })
    ];
  }

  /**
   * return checks conditions. See: https://github.com/panva/node-oidc-provider/blob/main/docs/README.md#interactionspolicy
   */
  details(ctx: KoaContextWithOIDC) {
    const {oidc} = ctx;

    return {
      ...(oidc.params?.max_age === undefined ? undefined : {max_age: oidc.params.max_age}),
      ...(oidc.params?.login_hint === undefined ? undefined : {login_hint: oidc.params.login_hint}),
      ...(oidc.params?.id_token_hint === undefined ? undefined : {id_token_hint: oidc.params.id_token_hint})
    };
  }

  @View("custom")
  async $prompt(
    @OidcCtx() oidcCtx: OidcCtx,
    @Prompt() prompt: Prompt,
    @OidcSession() session: OidcSession,
    @Params() params: Params,
    @Uid() uid: Uid
  ): Promise<any> {
    await oidcCtx.checkClientId();

    return oidcCtx.interactionPrompt({
      title: "Sign-in Custom",
      flash: false
    });
  }
}
