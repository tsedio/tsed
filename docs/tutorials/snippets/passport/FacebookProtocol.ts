import {Req} from "@tsed/common";
import {Inject} from "@tsed/di";
import {Args, OnInstall, OnVerify, Protocol} from "@tsed/passport";
import {Strategy, StrategyOptions} from "passport-facebook";

import {AuthService} from "../services/auth/AuthService";

@Protocol<StrategyOptions>({
  name: "facebook",
  useStrategy: Strategy,
  settings: {
    clientID: "FACEBOOK_APP_ID",
    clientSecret: "FACEBOOK_APP_SECRET",
    callbackURL: "http://www.example.com/auth/facebook/callback",
    profileFields: ["id", "emails", "name"]
  }
})
export class FacebookProtocol implements OnVerify, OnInstall {
  @Inject()
  private authService: AuthService;

  async $onVerify(@Req() req: Req, @Args() [accessToken, refreshToken, profile]: any) {
    profile.refreshToken = refreshToken;

    const user = await this.authService.findOne({facebookId: profile.id});

    return user ? user : false;
  }
}
