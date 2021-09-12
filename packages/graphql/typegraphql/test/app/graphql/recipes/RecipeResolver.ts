import {ResolverService} from "@tsed/typegraphql";
import {Arg, Query} from "type-graphql";
import {RecipeService} from "../../services/RecipeService";
import {Recipe} from "./Recipe";
import {RecipeNotFoundError} from "./RecipeNotFoundError";

@ResolverService(Recipe)
export class RecipeResolver {
  constructor(private recipeService: RecipeService) {}

  @Query((returns) => Recipe)
  async recipe(@Arg("id") id: string) {
    const recipe = await this.recipeService.findById(id);

    if (recipe === undefined) {
      throw new RecipeNotFoundError(id);
    }

    return recipe;
  }

  @Query((returns) => [Recipe], {description: "Get all the recipes from around the world "})
  async recipes(): Promise<Recipe[]> {
    return this.recipeService.findAll({});
  }
}
