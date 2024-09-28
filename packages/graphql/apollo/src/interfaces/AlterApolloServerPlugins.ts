import type {ApolloServerPlugin} from "@apollo/server";

import type {ApolloSettings} from "./ApolloSettings.js";

export interface AlterApolloServerPlugins {
  $alterApolloServerPlugins(
    plugins: ApolloServerPlugin[],
    serverSettings: ApolloSettings
  ): ApolloServerPlugin[] | Promise<ApolloServerPlugin[]>;
}
