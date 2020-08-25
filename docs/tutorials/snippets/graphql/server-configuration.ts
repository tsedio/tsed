import {Configuration} from "@tsed/common";
import "@tsed/platform-express";

@Configuration({
  componentsScan: [
    "${rootDir}/graphql/**/*.ts" // add this pattern to scan resolvers or datasources
  ],
  graphql: {
    "server1": {
      // GraphQL server configuration
      // path: string;
      // resolvers?: (Function | string)[];
      // dataSources?: Function;

      // apollo-server-express options
      // See options descriptions on https://www.apollographql.com/docs/apollo-server/api/apollo-server.html
      // serverConfig?: Config;
      // serverRegistration?: ServerRegistration;

      // type-graphql
      // See options descriptions on https://19majkel94.github.io/type-graphql/
      // buildSchemaOptions?: Partial<BuildSchemaOptions>;

      // apollo-server-express
      // installSubscriptionHandlers?: boolean;

      // server?: (config: Config) => ApolloServer;
    }
  }
})
export class Server {
}
