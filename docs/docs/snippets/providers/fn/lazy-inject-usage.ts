import {injectable, lazyInject} from "@tsed/di";

class MyInjectable {
  async use() {
    const myModule = await lazyInject(() => import("./MyModule.js"));

    myModule.doSomething();
  }
}

injectable(MyInjectable);
