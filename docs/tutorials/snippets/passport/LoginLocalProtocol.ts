import {Req} from "@tsed/common";
import {Inject} from "@tsed/di";
import {BeforeInstall, OnInstall, OnVerify, Protocol} from "@tsed/passport";
import {BodyParams} from "@tsed/platform-params";
import {IStrategyOptions, Strategy} from "passport-local";

import {Credentials} from "../models/Credentials";
import {UsersService} from "../services/users/UsersService";

@Protocol<IStrategyOptions>({
  name: "login",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class LoginLocalProtocol implements OnVerify, OnInstall, BeforeInstall {
  @Inject()
  private usersService: UsersService;

  // hook added with v6.99.0
  async $beforeInstall(settings: IStrategyOptions): Promise<IStrategyOptions> {
    // load something from backend
    // settings.usernameField = await this.usersService.loadFieldConfiguration()

    return settings;
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }

  async $onVerify(@Req() request: Req, @BodyParams() credentials: Credentials) {
    const {email, password} = credentials;

    const user = await this.usersService.findOne({email});

    if (!user) {
      return false;
      // OR throw new PassportMessage("Wrong credentials")
    }

    if (!user.verifyPassword(password)) {
      return false;
      // OR throw new PassportMessage("Wrong credentials")
    }

    return user;
  }
}
