import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/typegraphql";

@Configuration({
  componentsScan: [
    `./graphql/**/*.ts` // add this pattern to scan resolvers or datasources
  ],
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
