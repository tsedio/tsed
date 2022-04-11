import {BodyParams, Inject, Post} from "@tsed/common";
import {Env} from "@tsed/core";
import {Constant} from "@tsed/di";
import {BadRequest, Unauthorized} from "@tsed/exceptions";
import {Interaction, OidcCtx, OidcSession, Params, Prompt, Uid} from "@tsed/oidc-provider";
import {View} from "@tsed/platform-views";
import {Name} from "@tsed/schema";
import {Accounts} from "../services/Accounts";

@Interaction({
  name: "login"
})
@Name("Oidc")
export class LoginInteraction {
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
    const client = await oidcCtx.findClient();

    if (!client) {
      throw new Unauthorized(`Unknown client_id ${params.client_id}`);
    }

    return {
      client,
      uid,
      details: prompt.details,
      params,
      title: "Sign-in",
      flash: false,
      ...oidcCtx.debug()
    };
  }

  @Post("/login")
  @View("login")
  async submit(
    @BodyParams() payload: any,
    @Params() params: Params,
    @Uid() uid: Uid,
    @OidcSession() session: OidcSession,
    @Prompt() prompt: Prompt,
    @OidcCtx() oidcCtx: OidcCtx
  ) {
    if (prompt.name !== "login") {
      throw new BadRequest("Bad interaction name");
    }

    const client = await oidcCtx.findClient();

    const account = await this.accounts.authenticate(payload.email, payload.password);

    if (!account) {
      return {
        client,
        uid,
        details: prompt.details,
        params: {
          ...params,
          login_hint: payload.email
        },
        title: "Sign-in",
        flash: "Invalid email or password.",
        ...oidcCtx.debug()
      };
    }

    return oidcCtx.interactionFinished({
      login: {
        accountId: account.accountId
      }
    });
  }
}
