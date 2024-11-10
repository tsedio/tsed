import {Get} from "@tsed/schema";
import {Controller, Injectable, ProviderScope, Scope} from "@tsed/di";

@Injectable()
@Scope(ProviderScope.REQUEST)
export class MyService {
  public rand = Math.random() * 100;
}

@Controller("/")
@Scope(ProviderScope.REQUEST)
export class MyController {
  constructor(private myService: MyService) {}

  @Get("/random")
  getValue() {
    return this.myService.rand;
  }
}
