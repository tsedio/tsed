import {Req} from "@tsed/common";
import {Args, OnInstall, OnVerify, Protocol} from "@tsed/passport";
import {Strategy, StrategyOptions} from "passport-discord";
import * as refresh from "passport-oauth2-refresh";
import {AuthService} from "../services/auth/AuthService";

@Protocol<StrategyOptions>({
  name: "discord",
  useStrategy: Strategy,
  settings: {
    clientID: "id",
    clientSecret: "secret",
    callbackURL: "callbackURL"
  }
})
export class DiscordProtocol implements OnVerify, OnInstall {
  constructor(private authService: AuthService) {}

  async $onVerify(@Req() req: Req, @Args() [accessToken, refreshToken, profile]: any) {
    profile.refreshToken = refreshToken;

    const user = await this.authService.findOne({discordId: profile.id});

    return user ? user : false;
  }

  async $onInstall(strategy: Strategy) {
    refresh.use(strategy);
  }
}
