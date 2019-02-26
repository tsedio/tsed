import {ResolverService} from "@tsed/graphql";
import {Arg, Args, Query} from "type-graphql";
import {RecipeService} from "../../services/RecipeService";
import {Recipe} from "./Recipe";
import {RecipeArgs} from "./RecipeArgs";
import {RecipeNotFoundError} from "./RecipeNotFoundError";


@ResolverService(Recipe) // equivalent to @Resolver(Recipe) and @Service()
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
  recipes(@Args() {skip, take}: RecipeArgs) {
    return this.recipeService.findAll({skip, take});
  }
}
