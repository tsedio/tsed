import {ResolverService} from "@tsed/graphql";
import {Arg, Args, Query} from "type-graphql";
import {RecipeNotFoundError} from "../errors/RecipeNotFoundError";
import {RecipeService} from "../services/RecipeService";
import {Recipe} from "../types/Recipe";

@ResolverService(Recipe)
export class RecipeResolver {
  constructor(private recipeService: RecipeService) {
  }

  @Query(returns => Recipe)
  async recipe(@Arg("id") id: string) {
    const recipe = await this.recipeService.findById(id);
    if (recipe === undefined) {
      throw new RecipeNotFoundError(id);
    }

    return recipe;
  }

  @Query(returns => [Recipe])
  recipes(@Args() {skip, take}: RecipesArgs) {
    return this.recipeService.findAll({skip, take});
  }
}
