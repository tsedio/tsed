import {NotFound} from "ts-httpexceptions";

export class RecipeNotFoundError extends NotFound {
  constructor(private id: string) {
    super("Recipe not found");
  }
}
