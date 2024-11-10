import {ProviderScope} from "@tsed/di";
import {Get} from "@tsed/schema";

export class MyService {
  public rand = Math.random() * 100;
}

export class MyController {
  private myService = inject(MyService);

  @Get("/random")
  getValue() {
    return this.myService.rand;
  }
}

injectable(MyService).scope(ProviderScope.REQUEST);
controller(MyController).path("/").scope(ProviderScope.REQUEST);

