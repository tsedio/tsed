import {ProviderScope, controller} from "@tsed/di";
import {Get} from "@tsed/schema";

export class MyController {
  // Generates a random number between 0 and 100 for each request
  private rand = Math.random() * 100;

  @Get("/random")
  getRequestScopedRandom() {
    return this.rand;
  }
}

controller(MyController)
  .path("/")
  .scope(ProviderScope.REQUEST);
