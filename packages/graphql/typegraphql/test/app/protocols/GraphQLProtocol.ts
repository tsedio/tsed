import {Arg, OnVerify, Protocol} from "@tsed/passport";
import {GraphQLLocalStrategy} from "graphql-passport";
import {Inject} from "@tsed/di";
import {Req} from "@tsed/platform-http";
import {Unauthorized} from "@tsed/exceptions";
import {UsersRepository} from "../services/UsersRepository.js";

@Protocol<any>({
  name: "graphql-local",
  useStrategy: GraphQLLocalStrategy,
  settings: {}
})
export class GraphQLProtocol implements OnVerify {
  @Inject()
  protected repository: UsersRepository;

  async $onVerify(@Req() request: Req, @Arg(0) email: string, @Arg(1) password: string) {
    const user = await this.repository.authenticate(email, password);

    if (!user) {
      throw new Unauthorized("Wrong credentials");
    }

    return user;
  }
}
