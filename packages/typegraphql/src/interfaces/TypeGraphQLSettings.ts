import {ApolloSettings} from "@tsed/apollo";
import {Config} from "apollo-server-core";
import {BuildSchemaOptions} from "type-graphql";

export interface TypeGraphQLSettings extends ApolloSettings {
  // Basic options
  path: string;
  // TypeGraphQL options
  buildSchemaOptions?: BuildSchemaOptions;
  // apollo-server-express options
  // See options descriptions on https://www.apollographql.com/docs/apollo-server/api/apollo-server.html
  serverConfig?: Config;
}
