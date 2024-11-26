import {createPubSub} from "@graphql-yoga/subscription";
import {injectable} from "@tsed/di";

import {RecipeNotification} from "../recipes/Recipe.js";

export const pubSub = createPubSub<{
  NOTIFICATIONS: [RecipeNotification];
}>();

export const PubSubProvider = injectable(Symbol.for("PubSubProvider")).value(pubSub).token();
export type PubSubProvider = typeof pubSub;
