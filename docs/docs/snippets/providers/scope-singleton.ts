import {Controller, Get, ProviderScope, Scope} from "@tsed/common";

@Controller("/")
@Scope(ProviderScope.SINGLETON)  // OPTIONAL, leaving this annotation a the same behavior
export class MyController {
  private rand = Math.random() * 100;

  @Get("/random")
  async getValue() {
    return this.rand;
  }
}
