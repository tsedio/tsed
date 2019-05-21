import {Controller, Get, ProviderScope, Scope, Service} from "@tsed/common";

@Service()
@Scope(ProviderScope.REQUEST)
export class MyService {
  public rand = Math.random() * 100;
}

@Controller("/")
@Scope(ProviderScope.REQUEST)
export class MyController {
  constructor(private myService: MyService) {
  }

  @Get("/random")
  async getValue() {
    return this.myService.rand;
  }
}
