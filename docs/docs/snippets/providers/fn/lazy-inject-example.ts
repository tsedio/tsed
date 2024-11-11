import {Injectable, lazyInject} from "@tsed/di";

@Injectable()
class MyInjectable {
  async use() {
    try {
      /// do something
    } catch (er) {
      const exceptions = await lazyInject(() => import("@tsed/platform-exceptions"));
      exceptions.catch(er, {});
    }
  }
}
