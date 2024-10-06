import type {ApolloServer, ApolloServerOptions, ApolloServerOptionsWithSchema} from "@apollo/server";
import type {GatewayInterface} from "@apollo/server-gateway-interface";
import type {IExecutableSchemaDefinition} from "@graphql-tools/schema";
import type {GraphQLSchema} from "graphql/index.js";

import type {ApolloContext} from "./ApolloContext.js";

export type ApolloMiddlewareOptions = Record<string, any>;
export type ApolloCustomServerCB<TContext extends ApolloContext> = (config: ApolloServerOptions<TContext>) => ApolloServer<TContext>;

declare global {
  namespace TsED {
    interface ApolloSettings {}
  }
}

export type ApolloServerOptionsBase<TContext extends ApolloContext = ApolloContext> = Omit<
  ApolloServerOptionsWithSchema<TContext>,
  "schema" | "typeDefs" | "resolvers" | "gateway"
>;

export type ApolloSettings<TContext extends ApolloContext = ApolloContext> = ApolloServerOptionsBase<TContext> &
  TsED.ApolloSettings & {
    // Basic options
    path: string;
    server?: ApolloCustomServerCB<TContext>;
    playground?: boolean;
    // ApplyMiddleware Options
    // See options descriptions on https://www.apollographql.com/docs/apollo-server/api/apollo-server.html
    serverRegistration?: ApolloMiddlewareOptions;
    middlewareOptions?: ApolloMiddlewareOptions;
    schema?: GraphQLSchema;
    typeDefs?: IExecutableSchemaDefinition<TContext>["typeDefs"];
    resolvers?: IExecutableSchemaDefinition<TContext>["resolvers"];
    gateway?: GatewayInterface;
    /**
     * @deprecated use $alterApolloContext instead
     */
    dataSources?: () => Record<string, unknown>;
  };

export type ApolloSettingsWithID<TContext extends ApolloContext = ApolloContext> = ApolloSettings<TContext> & {
  id: string;
};
