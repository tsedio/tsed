import {Req} from "@tsed/common";
import {Arg, OnInstall, OnVerify, Protocol} from "@tsed/passport";
import {Strategy} from "passport";
import {BasicStrategy} from "passport-http";

import {UsersService} from "../services/users/UsersService";
import {checkEmail} from "../utils/checkEmail";

@Protocol({
  name: "basic",
  useStrategy: BasicStrategy,
  settings: {}
})
export class BasicProtocol implements OnVerify, OnInstall {
  constructor(private usersService: UsersService) {}

  async $onVerify(@Req() request: Req, @Arg(0) username: string, @Arg(1) password: string) {
    checkEmail(username);

    const user = await this.usersService.findOne({email: username});

    if (!user) {
      return false;
    }

    if (!user.verifyPassword(password)) {
      return false;
    }

    return user;
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }
}
