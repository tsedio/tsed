import {ApolloService} from "@tsed/apollo";
import {AfterRoutesInit} from "@tsed/common";
import {Inject, Injectable} from "@tsed/di";
import {ApolloServer} from "apollo-server-express";

@Injectable()
export class UsersService implements AfterRoutesInit {
  @Inject()
  private ApolloService: ApolloService;
  // or private typeGraphQLService: TypeGraphQLService;

  private server: ApolloServer;

  $afterRoutesInit() {
    this.server = this.apolloService.get("server1")!;
  }
}
