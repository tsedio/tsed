import {Env} from "@tsed/core";
import {Constant, Inject} from "@tsed/di";
import {BodyParams} from "@tsed/platform-params";
import {Name, Post, View} from "@tsed/schema";

import {Interaction, InteractionMethods, OidcCtx, OidcSession, Params, Prompt, Uid} from "../../../src/index.js";
import {Accounts} from "../services/Accounts.js";

@Interaction({
  name: "login",
  requestable: true
})
@Name("Oidc")
export class LoginInteraction implements InteractionMethods {
  @Constant("env")
  env: Env;

  @Inject()
  accounts: Accounts;

  $onCreate() {}

  @View("login")
  async $prompt(
    @OidcCtx() oidcCtx: OidcCtx,
    @Prompt() prompt: Prompt,
    @OidcSession() session: OidcSession,
    @Params() params: Params,
    @Uid() uid: Uid
  ): Promise<any> {
    await oidcCtx.checkClientId();

    return oidcCtx.interactionPrompt({
      title: "Sign-in",
      flash: false
    });
  }

  @Post("/login")
  @View("login")
  async submit(@BodyParams() payload: any, @OidcCtx() oidcCtx: OidcCtx) {
    oidcCtx.checkInteractionName("login");

    const account = await this.accounts.authenticate(payload.email, payload.password);

    if (!account) {
      return oidcCtx.interactionPrompt({
        params: {
          login_hint: payload.email
        },
        title: "Sign-in",
        flash: "Invalid email or password."
      });
    }

    return oidcCtx.interactionFinished({
      login: {
        accountId: account.accountId
      }
    });
  }
}
