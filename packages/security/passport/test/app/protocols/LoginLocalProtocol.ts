import {IStrategyOptions, Strategy} from "passport-local";
import {OnInstall, OnVerify, Protocol} from "../../../src/index.js";
import {BodyParams} from "@tsed/platform-params";
import {Credentials} from "../models/Credentials.js";
import {Inject} from "@tsed/di";
import {Req} from "@tsed/platform-http";
import {Unauthorized} from "@tsed/exceptions";
import {UsersRepository} from "../services/UsersRepository.js";

@Protocol<IStrategyOptions>({
  name: "login",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class LoginLocalProtocol implements OnVerify, OnInstall {
  @Inject()
  private usersService: UsersRepository;

  async $onVerify(@Req() request: Req, @BodyParams() credentials: Credentials) {
    const {email, password} = credentials;

    const user = await this.usersService.findByEmail(email);

    if (!user || !user.verifyPassword(password)) {
      throw new Unauthorized("Wrong credentials");
    }

    return user;
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }
}
