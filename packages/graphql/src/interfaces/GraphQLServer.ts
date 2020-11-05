import {ApolloServerBase} from "apollo-server-core";
import {GraphQLSchema} from "graphql";

export interface GraphQLServer {
  instance: ApolloServerBase;
  schema: GraphQLSchema;
}
