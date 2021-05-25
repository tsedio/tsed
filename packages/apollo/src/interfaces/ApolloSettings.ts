import type {Config} from "apollo-server-core";
import type {ApolloServerBase} from "apollo-server-core";

export type ApolloServer = ApolloServerBase & {applyMiddleware(settings: any): any};

export interface ApolloSettings extends Config {
  // Basic options
  path: string;
  server?: (config: Config) => ApolloServer;

  // apollo-server-express
  // apollo-server-express options
  // See options descriptions on https://www.apollographql.com/docs/apollo-server/api/apollo-server.html
  serverRegistration?: Record<string, any>;
  installSubscriptionHandlers?: boolean;
}
