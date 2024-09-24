import {Req} from "@tsed/common";
import {Forbidden} from "@tsed/exceptions";
import {OnInstall, OnVerify, Protocol} from "@tsed/passport";
import {BodyParams} from "@tsed/platform-params";
import {Strategy} from "passport-local";

import {UserCreation} from "../models/UserCreation";
import {UsersService} from "../services/users/UsersService";

@Protocol({
  name: "signup",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class SignupLocalProtocol implements OnVerify, OnInstall {
  constructor(private usersService: UsersService) {}

  async $onVerify(@Req() request: Req, @BodyParams() user: UserCreation) {
    const {email} = user;
    const found = await this.usersService.findOne({email});

    if (found) {
      throw new Forbidden("Email is already registered");
    }

    return this.usersService.create(user);
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }
}
