import {Controller, Injectable, ProviderScope, Scope} from "@tsed/di";
import {Get} from "@tsed/schema";

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
  async getValue() {
    return this.myService.rand;
  }
}
