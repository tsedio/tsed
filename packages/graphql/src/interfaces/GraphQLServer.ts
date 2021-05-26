import {ApolloServerBase} from "apollo-server-core";
import {GraphQLSchema} from "graphql";
/**
 * @ignore
 */
export interface GraphQLServer {
  instance: ApolloServerBase;
  schema: GraphQLSchema;
}
