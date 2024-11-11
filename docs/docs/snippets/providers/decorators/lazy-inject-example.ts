import {Injectable, LazyInject} from "@tsed/di";
import type {PlatformExceptions} from "@tsed/platform-exceptions";

@Injectable()
class MyInjectable {
  @LazyInject(() => import("@tsed/platform-exceptions"))
  private platformExceptions: Promise<PlatformExceptions>;

  async use() {
    try {
      /// do something
    } catch (er) {
      const exceptions = await this.platformExceptions;
      exceptions.catch(er, {});
    }
  }
}
