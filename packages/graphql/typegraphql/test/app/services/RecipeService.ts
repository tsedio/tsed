import {Service} from "@tsed/di";

import {Recipe} from "../graphql/recipes/Recipe.js";

@Service()
export class RecipeService {
  recipes: Recipe[] = [
    new Recipe({
      id: "1",
      title: "title",
      description: "Description",
      creationDate: new Date("2020-08-20"),
      ingredients: []
    })
  ];

  create(recipe: Pick<Recipe, "title" | "description">) {
    const newRecipe = new Recipe({
      id: String(this.recipes.length + 1),
      title: recipe.title,
      description: recipe.description,
      creationDate: new Date(),
      ingredients: []
    });

    this.recipes.push(newRecipe);

    return Promise.resolve(newRecipe);
  }

  findById(id: string) {
    return Promise.resolve(this.recipes.find((item) => item.id === id));
  }

  findAll(options: any) {
    return Promise.resolve(this.recipes);
  }
}
