import type {ApolloContext} from "./ApolloContext.js";
import type {ApolloSettingsWithID} from "./ApolloSettings.js";

export interface AlterApolloSettings<Context extends ApolloContext = ApolloContext> {
  $alterApolloSettings(settings: ApolloSettingsWithID<Context>):
    | (ApolloSettingsWithID<Context> & {
        id: string;
      })
    | Promise<ApolloSettingsWithID<Context>>;
}
