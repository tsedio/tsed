import {ApolloServer, Config, ServerRegistration} from "apollo-server-express";
import {BuildSchemaOptions} from "type-graphql";

export interface IGraphQLSettings {
  // Basic options
  path: string;
  resolvers?: (Function | string)[];
  dataSources?: Function;

  // apollo-server-express options
  // See options descriptions on https://www.apollographql.com/docs/apollo-server/api/apollo-server.html
  serverConfig?: Config;
  serverRegistration?: ServerRegistration;

  // type-graphql
  // See options descriptions on https://19majkel94.github.io/type-graphql/
  buildSchemaOptions?: BuildSchemaOptions;

  // apollo-server-express
  installSubscriptionHandlers?: boolean;

  server?: (config: Config) => ApolloServer;
}
