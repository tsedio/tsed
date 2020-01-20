import {BodyParams, Req} from "@tsed/common";
import {OnInstall, OnVerify, Protocol} from "@tsed/passport";
import {Strategy} from "passport";
import {BasicStrategy} from "passport-http";
import {UserRepository} from "../repositories/UserRepository";
import {checkEmail} from "../utils/checkEmail";

@Protocol({
  name: "basic",
  // @ts-ignore
  useStrategy: BasicStrategy,
  settings: {}
})
export class BasicProtocol implements OnVerify, OnInstall {
  constructor(private userRepository: UserRepository) {
  }

  async $onVerify(@Req() request: Req, @BodyParams("username") username: string, @BodyParams("password") password: string) {
    checkEmail(username);

    const user = await this.userRepository.findOne({email: username});

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
