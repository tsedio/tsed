import type {ApolloServerBase, Config, ApolloServerPluginLandingPageGraphQLPlaygroundOptions} from "apollo-server-core";

export type ApolloMiddlewareOptions = Record<string, any>;
export type ApolloServer = ApolloServerBase & {getMiddleware(settings: ApolloMiddlewareOptions): any};
export type ApolloCustomServerCB = (config: ApolloConfig) => ApolloServer;
export type ApolloConfig = Config;

export interface ApolloSettings extends ApolloConfig {
  // Basic options
  path: string;
  server?: ApolloCustomServerCB;
  playground?: boolean | ApolloServerPluginLandingPageGraphQLPlaygroundOptions;
  // ApplyMiddleware Options
  // See options descriptions on https://www.apollographql.com/docs/apollo-server/api/apollo-server.html
  serverRegistration?: ApolloMiddlewareOptions;
  middlewareOptions?: ApolloMiddlewareOptions;
}
