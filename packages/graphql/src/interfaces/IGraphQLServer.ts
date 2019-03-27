import {ApolloServer} from "apollo-server-express";
import {GraphQLSchema} from "graphql";

export interface IGraphQLServer {
  instance: ApolloServer;
  schema: GraphQLSchema;
}
