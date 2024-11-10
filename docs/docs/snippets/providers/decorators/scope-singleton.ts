import {Get} from "@tsed/schema";
import {Controller, ProviderScope, Scope} from "@tsed/di";

@Controller("/")
@Scope(ProviderScope.SINGLETON) // OPTIONAL, leaving this annotation a the same behavior
export class MyController {
  private rand = Math.random() * 100;

  @Get("/random")
  getValue() {
    return this.rand;
  }
}
