import type {ApolloServerPlugin} from "@apollo/server";
import type {ApolloSettings} from "./ApolloSettings";

export interface AlterApolloServerPlugins {
  $alterApolloServerPlugins(
    plugins: ApolloServerPlugin[],
    serverSettings: ApolloSettings
  ): ApolloServerPlugin[] | Promise<ApolloServerPlugin[]>;
}
