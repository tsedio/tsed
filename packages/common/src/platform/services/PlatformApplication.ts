import {Injectable, ProviderScope} from "@tsed/di";
import {PlatformStaticsOptions} from "../../config/interfaces";
import {createFakeRawDriver} from "./FakeRawDriver";
import {PlatformDriver} from "./PlatformDriver";
import {PlatformHandler} from "./PlatformHandler";

declare global {
  namespace TsED {
    // @ts-ignore
    export interface Application {}
  }
}

/**
 * `PlatformApplication` is used to provide all routes collected by annotation `@Controller`.
 *
 * @platform
 */
@Injectable({
  scope: ProviderScope.SINGLETON
})
export class PlatformApplication<T = TsED.Application> extends PlatformDriver<T> {
  public raw: T;

  constructor(platformHandler: PlatformHandler) {
    super(platformHandler);
    this.raw = PlatformApplication.createRawApp() as any; // f
  }

  protected static createRawApp(): any {
    return createFakeRawDriver();
  }

  statics(endpoint: string, options: PlatformStaticsOptions) {
    console.warn("Statics methods aren't implemented on this platform");
  }
}
