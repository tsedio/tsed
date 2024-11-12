import {Get} from "@tsed/schema";
import {Controller, ProviderScope, Scope} from "@tsed/di";

@Controller("/")
@Scope(ProviderScope.REQUEST)
export class MyController {
  // Generates a random number between 0 and 100 for each request
  private rand = Math.random() * 100;

  @Get("/random")
  getRequestScopedRandom() {
    return this.rand;
  }
}
