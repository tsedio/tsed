import {Get} from "@tsed/schema";

export class MyInstanceService {
  private rand = Math.random() * 100;

  @Get("/random")
  getValue() {
    return this.rand;
  }
}

export class MyController {
  constructor() {
    const instance1 = inject(MyInstanceService)
    const instance2 = inject(MyInstanceService)
    console.log("IsSame", instance1 === instance2); // false
    console.log("instance1", instance1.getValue());
    console.log("instance2", instance2.getValue());
  }
}

injectable(MyInstanceService).scope(ProviderScope.INSTANCE)
controller(MyController) // by default, the scope is SINGLETON

