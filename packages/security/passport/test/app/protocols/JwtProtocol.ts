import {Inject} from "@tsed/di";
import {Req} from "@tsed/platform-http";
import {Arg, OnVerify, Protocol} from "../../../src/index.js";
import {UsersRepository} from "../services/UsersRepository.js";
import {BearerStrategy} from "./BearerStrategy.js";

export const VALID_TOKEN = "valid-token";

@Protocol({
  name: "jwt",
  useStrategy: BearerStrategy,
  settings: {}
})
export class JwtProtocol implements OnVerify {
  @Inject()
  private usersService: UsersRepository;

  async $onVerify(@Req() request: Req, @Arg(0) token: string) {
    return token === VALID_TOKEN ? this.usersService.findByEmail("admin@tsed.dev") : false;
  }
}
