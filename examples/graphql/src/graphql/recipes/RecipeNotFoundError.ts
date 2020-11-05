import {NotFound} from "@tsed/exceptions";

export class RecipeNotFoundError extends NotFound {
  constructor(private id: string) {
    super(`Recipe ${id} not found`);
  }
}
