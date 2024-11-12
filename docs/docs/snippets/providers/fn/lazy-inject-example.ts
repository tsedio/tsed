import {injectable, lazyInject} from "@tsed/di";

class MyInjectable {
  async use() {
    try {
      /// do something
      // Example: Perform some operation that might fail
       await someAsyncOperation();
    } catch (er) {
      const exceptions = await lazyInject(() => import("@tsed/platform-exceptions"));
      // Handle the error with appropriate options
      exceptions.catch(er, injectContext());
    }
  }
}

injectable(MyInjectable);
