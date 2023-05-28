import {Service} from "@tsed/common";
import {Recipe} from "../graphql/recipes/Recipe";

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

  findById(id: string) {
    return Promise.resolve(this.recipes.find((item) => item.id === id));
  }

  findAll(options: any) {
    return Promise.resolve(this.recipes);
  }
}
