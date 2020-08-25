import {ApolloServer} from "apollo-server-express";
import {GraphQLSchema} from "graphql";

export interface GraphQLServer {
  instance: ApolloServer;
  schema: GraphQLSchema;
}
