import {InjectContext, PlatformContext} from "@tsed/common";
import {Inject} from "@tsed/di";
import {Arg, Mutation, Query, Root, Subscription} from "type-graphql";

import {ResolverController} from "../../../..";
import {RecipeService} from "../../services/RecipeService";
import {PubSubProvider} from "../pubsub/pubsub.js";
import {Recipe, RecipeNotification} from "./Recipe";
import {RecipeNotFoundError} from "./RecipeNotFoundError";

@ResolverController((_of) => Recipe)
export class RecipeResolver {
  @InjectContext()
  private $ctx: PlatformContext;

  @Inject()
  private recipeService: RecipeService;

  @Inject(PubSubProvider)
  private pubSub: PubSubProvider;

  @Query((returns) => Recipe)
  async recipe(@Arg("id") id: string) {
    const recipe = await this.recipeService.findById(id);

    if (recipe === undefined) {
      throw new RecipeNotFoundError(id);
    }

    return recipe;
  }

  @Query((returns) => [Recipe], {description: "Get all the recipes from around the world "})
  recipes(): Promise<Recipe[]> {
    this.$ctx.set("test", "test");
    return this.recipeService.findAll({});
  }

  @Mutation((returns) => Recipe)
  async addRecipe(@Arg("title") title: string, @Arg("description") description: string) {
    const payload = await this.recipeService.create({title, description});
    const notification = new RecipeNotification(payload);

    this.pubSub.publish("NOTIFICATIONS", notification);

    return payload;
  }

  @Subscription(() => RecipeNotification, {
    topics: "RECIPE_ADDED"
  })
  newRecipe(@Root() payload: Recipe): RecipeNotification {
    return {...payload, date: new Date()};
  }
}
