import {ApolloServer, Config, ServerRegistration} from "apollo-server-express";
import {BuildSchemaOptions} from "type-graphql";

export interface GraphQLSettings {
  // Basic options
  path: string;
  resolvers?: (Function | string)[];
  dataSources?: Function;

  // apollo-server-express options
  // See options descriptions on https://www.apollographql.com/docs/apollo-server/api/apollo-server.html
  serverConfig?: Config;
  serverRegistration?: Omit<ServerRegistration, "app">;

  // type-graphql
  // See options descriptions on https://19majkel94.github.io/type-graphql/
  buildSchemaOptions?: Partial<BuildSchemaOptions>;

  // apollo-server-express
  installSubscriptionHandlers?: boolean;

  server?: (config: Config) => ApolloServer;
}
