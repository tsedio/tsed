import {ProviderScope} from "@tsed/di";
import {Get} from "@tsed/schema";

export class MyController {
  private rand = Math.random() * 100;

  @Get("/random")
  getValue() {
    return this.rand;
  }
}

controller(MyController)
  .path("/")
  .scope(ProviderScope.REQUEST);
