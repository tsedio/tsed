import {Injectable, LazyInject} from "@tsed/di";
import type {default as MyModule} from "./MyModule.js";

@Injectable()
class MyInjectable {
  @LazyInject(() => import("./MyModule.js"))
  private myModule: Promise<MyModule>;

  async use() {
    const myModule = await this.myModule;

    myModule.doSomething();
  }
}
