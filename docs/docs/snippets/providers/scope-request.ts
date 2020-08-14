import {Controller, Get, ProviderScope, Scope} from "@tsed/common";

@Controller("/")
@Scope(ProviderScope.REQUEST)
export class MyController {
  private rand = Math.random() * 100;

  @Get("/random")
  async getValue() {
    return this.rand;
  }
}
