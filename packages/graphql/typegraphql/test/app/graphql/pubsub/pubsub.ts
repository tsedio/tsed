import {createPubSub} from "@graphql-yoga/subscription";
import {registerProvider} from "@tsed/di";

import {RecipeNotification} from "../recipes/Recipe.js";

export const pubSub = createPubSub<{
  NOTIFICATIONS: [RecipeNotification];
}>();

export const PubSubProvider = Symbol.for("PubSubProvider");
export type PubSubProvider = typeof pubSub;

registerProvider({
  provide: PubSubProvider,
  useValue: pubSub
});
