import {AfterRoutesInit, Service} from "@tsed/common";
import {GraphQLService} from "@tsed/graphql";
import {ApolloServer} from "apollo-server-express";

@Service()
export class UsersService implements AfterRoutesInit {
  private server: ApolloServer;

  constructor(private graphQLService: GraphQLService) {

  }

  $afterRoutesInit() {
    this.server = this.graphQLService.get("server1")!;
  }
}
