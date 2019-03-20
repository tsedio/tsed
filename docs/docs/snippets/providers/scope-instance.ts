import {Controller, Get, ProviderScope, Scope, Service} from "@tsed/common";

@Service()
@Scope(ProviderScope.INSTANCE)  // OPTIONAL, leaving this annotation a the same behavior
export class MyInstanceService {
  private rand = Math.random() * 100;

  @Get("/random")
  async getValue() {
    return this.rand;
  }
}

@Controller("/")
@Scope(ProviderScope.SINGLETON)  // OPTIONAL, leaving this annotation a the same behavior
export class MyController {
  constructor(instance1: MyInstanceService, instance2: MyInstanceService) {
    console.log("IsSame", instance1 === instance2);
    console.log("instance1", instance1.getValue());
    console.log("instance2", instance2.getValue());
  }
}
