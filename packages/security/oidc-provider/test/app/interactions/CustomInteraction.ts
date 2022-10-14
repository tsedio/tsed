import {Inject, View} from "@tsed/common";
import {Env} from "@tsed/core";
import {Constant} from "@tsed/di";
import {Interaction, OidcCtx, OidcSession, Params, Prompt, Uid} from "@tsed/oidc-provider";
import {Name} from "@tsed/schema";
import {Accounts} from "../services/Accounts";

@Interaction({
  name: "custom",
  requestable: true
})
@Name("Oidc")
export class CustomInteraction {
  @Constant("env")
  env: Env;

  @Inject()
  accounts: Accounts;

  $onCreate() {}

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
