import {InjectContext, PlatformContext} from "@tsed/common";
import {Inject} from "@tsed/di";
import {ResolverController} from "@tsed/typegraphql";
import {Arg, Mutation, Publisher, PubSub, Query, Root, Subscription} from "type-graphql";
import {RecipeService} from "../../services/RecipeService.js";
import {Recipe, RecipeNotification} from "./Recipe.js";
import {RecipeNotFoundError} from "./RecipeNotFoundError.js";

@ResolverController((_of) => Recipe)
export class RecipeResolver {
  @InjectContext()
  private $ctx: PlatformContext;

  @Inject()
  private recipeService: RecipeService;

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
  async addRecipe(
    @Arg("title") title: string,
    @Arg("description") description: string,
    @PubSub("NOTIFICATIONS") publish: Publisher<Recipe>
  ) {
    const payload = await this.recipeService.create({title, description});
    await publish(payload);

    return payload;
  }

  @Subscription(() => RecipeNotification, {
    topics: "RECIPE_ADDED"
  })
  newRecipe(@Root() payload: Recipe): RecipeNotification {
    return {...payload, date: new Date()};
  }
}
