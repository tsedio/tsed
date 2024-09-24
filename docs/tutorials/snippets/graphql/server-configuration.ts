import "@tsed/platform-express";
import "@tsed/typegraphql";
import "./resolvers/index.js"; // barrel file with all resolvers

import {Configuration} from "@tsed/di";

@Configuration({
  typegraphql: {
    server1: {
      // GraphQL server configuration
      path: "/",
      playground: true, // enable playground GraphQL IDE. Set false to use Apollo Studio

      // resolvers?: (Function | string)[];
      // dataSources?: Function;
      // server?: (config: Config) => ApolloServer;

      // Apollo Server options
      // See options descriptions on https://www.apollographql.com/docs/apollo-server/api/apollo-server.html
      serverConfig: {
        plugins: []
      }

      // middlewareOptions?: ServerRegistration;

      // type-graphql
      // See options descriptions on https://19majkel94.github.io/type-graphql/
      // buildSchemaOptions?: Partial<BuildSchemaOptions>;
    }
  }
})
export class Server {}
