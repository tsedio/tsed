import {BodyParams, Req} from "@tsed/common";
import {OnInstall, OnVerify, Protocol, UserInfo} from "@tsed/passport";
import {Strategy} from "passport-local";
import {UserRepository} from "../repositories/UserRepository";
import {checkEmail} from "../utils/checkEmail";

@Protocol({
  name: "login",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class LoginLocalProtocol implements OnVerify, OnInstall {
  constructor(private userRepository: UserRepository) {
  }

  async $onVerify(@Req() request: Req, @BodyParams() credentials: UserInfo) {
    const {email, password} = credentials;

    checkEmail(email);

    const user = await this.userRepository.findOne({email});

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
