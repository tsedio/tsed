import type {ApolloServerBase, ApolloServerPluginLandingPageGraphQLPlaygroundOptions, Config} from "apollo-server-core";

export type ApolloMiddlewareOptions = Record<string, any>;
export type ApolloServer = ApolloServerBase & {getMiddleware(settings: ApolloMiddlewareOptions): any};
export type ApolloCustomServerCB = (config: ApolloConfig) => ApolloServer;
export type ApolloConfig = Config;

declare global {
  namespace TsED {
    interface ApolloSettings {}
  }
}

export interface ApolloSettings extends ApolloConfig, TsED.ApolloSettings {
  // Basic options
  path: string;
  server?: ApolloCustomServerCB;
  playground?: boolean | ApolloServerPluginLandingPageGraphQLPlaygroundOptions;
  // ApplyMiddleware Options
  // See options descriptions on https://www.apollographql.com/docs/apollo-server/api/apollo-server.html
  serverRegistration?: ApolloMiddlewareOptions;
  middlewareOptions?: ApolloMiddlewareOptions;
}
