import {Get} from "@tsed/schema";
import {Controller, ProviderScope, Scope} from "@tsed/di";

@Controller("/")
@Scope(ProviderScope.REQUEST)
export class MyController {
  private rand = Math.random() * 100;

  @Get("/random")
  getValue() {
    return this.rand;
  }
}
