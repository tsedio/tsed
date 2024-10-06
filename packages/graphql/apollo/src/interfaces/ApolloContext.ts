import type {BaseContext} from "@apollo/server";

export interface ApolloContext extends BaseContext {
  dataSources: Record<string, unknown>;
}
