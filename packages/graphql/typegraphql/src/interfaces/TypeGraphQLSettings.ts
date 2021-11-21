import {ApolloConfig, ApolloSettings} from "@tsed/apollo";
import {BuildSchemaOptions} from "type-graphql";

export interface TypeGraphQLSettings extends ApolloSettings {
  // TypeGraphQL options
  buildSchemaOptions?: Partial<BuildSchemaOptions>;
  // apollo-server-express options
  // See options descriptions on https://www.apollographql.com/docs/apollo-server/api/apollo-server.html
  serverConfig?: ApolloConfig;
}
