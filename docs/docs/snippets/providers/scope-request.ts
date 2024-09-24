import {Controller, ProviderScope, Scope} from "@tsed/di";
import {Get} from "@tsed/schema";

@Controller("/")
@Scope(ProviderScope.REQUEST)
export class MyController {
  private rand = Math.random() * 100;

  @Get("/random")
  async getValue() {
    return this.rand;
  }
}
