import {Injectable, ProviderScope} from "@tsed/di";
import {createFakeRawDriver} from "./FakeRawDriver";
import {PlatformDriver} from "./PlatformDriver";
import {PlatformHandler} from "./PlatformHandler";

declare global {
  namespace TsED {
    export interface Application {
    }
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
    return createFakeRawDriver();
  }
}
