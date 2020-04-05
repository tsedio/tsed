import {Injectable, ProviderScope} from "@tsed/di";
import {PlatformDriver} from "./PlatformDriver";
import {PlatformHandler} from "./PlatformHandler";

declare global {
  namespace TsED {
    export interface Application {}
  }
}

/**
 * `PlatformApplication` is used to provide all routes collected by annotation `@Controller`.
 */
@Injectable({
  scope: ProviderScope.SINGLETON
})
export class PlatformApplication extends PlatformDriver<TsED.Application> {
  constructor(platformHandler: PlatformHandler) {
    super(platformHandler);
    this.raw = PlatformApplication.createRawApp() as any; // f
  }

  protected static createRawApp(): any {
    function fakeApp() {}

    function use() {
      return this;
    }

    fakeApp.use = use;
    fakeApp.all = use;
    fakeApp.get = use;
    fakeApp.patch = use;
    fakeApp.post = use;
    fakeApp.put = use;
    fakeApp.head = use;
    fakeApp.delete = use;
    fakeApp.options = use;

    return fakeApp;
  }
}
