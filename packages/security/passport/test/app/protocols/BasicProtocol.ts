import {Inject} from "@tsed/di";
import {Req} from "@tsed/platform-http";
import {BasicStrategy} from "passport-http";
import {Arg, OnVerify, Protocol} from "../../../src/index.js";
import {UsersRepository} from "../services/UsersRepository.js";

@Protocol({
  name: "basic",
  useStrategy: BasicStrategy,
  settings: {}
})
export class BasicProtocol implements OnVerify {
  @Inject()
  private usersService: UsersRepository;

  async $onVerify(@Req() request: Req, @Arg(0) email: string, @Arg(1) password: string) {
    const user = await this.usersService.findByEmail(email);

    return user && user.verifyPassword(password) ? user : false;
  }
}
