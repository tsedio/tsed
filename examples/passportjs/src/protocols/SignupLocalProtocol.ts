import {BodyParams, Req} from "@tsed/common";
import {OnInstall, OnVerify, Protocol} from "@tsed/passport";
import {Strategy} from "passport-local";
import {BadRequest} from "ts-httpexceptions";
import {UserCreation} from "../models/UserCreation";
import {UsersService} from "../services/users/UsersService";
import {checkEmail} from "../utils/checkEmail";

@Protocol({
  name: "signup",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class SignupLocalProtocol implements OnVerify, OnInstall {
  constructor(private usersService: UsersService) {
  }

  async $onVerify(@Req() request: Req, @BodyParams() user: UserCreation) {
    const {email} = user;

    checkEmail(email);

    const found = await this.usersService.findOne({email});

    if (found) {
      throw new BadRequest("Email is already registered");
    }

    return this.usersService.create(user);
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }
}
