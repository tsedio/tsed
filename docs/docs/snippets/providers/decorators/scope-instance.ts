import {Get} from "@tsed/schema";
import {Controller, Injectable, ProviderScope, Scope} from "@tsed/di";

@Injectable()
@Scope(ProviderScope.INSTANCE)
export class MyInstanceService {
  private rand = Math.random() * 100;

  @Get("/random")
  getValue() {
    return this.rand;
  }
}

@Controller("/")
@Scope(ProviderScope.SINGLETON)
export class MyController {
  constructor(instance1: MyInstanceService, instance2: MyInstanceService) {
    console.log("IsSame", instance1 === instance2); // false
    console.log("instance1", instance1.getValue());
    console.log("instance2", instance2.getValue());
  }
}
