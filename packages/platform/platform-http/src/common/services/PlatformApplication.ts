import {ProviderScope, injectable} from "@tsed/di";
import {PlatformRouter} from "@tsed/platform-router";

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
export class PlatformApplication<App = TsED.Application> extends PlatformRouter {
  rawApp!: App;

  rawCallback(): any {}

  getApp(): App {
    return this.rawApp;
  }

  callback(): (request: unknown, response: unknown) => any;
  callback<Req, Res>(request: Req, response: Res): any;
  callback(request?: unknown, response?: unknown) {
    if (request && response) {
      return this.callback()(request, response);
    }

    return this.rawCallback();
  }
}

injectable(PlatformApplication).scope(ProviderScope.SINGLETON).alias("PlatformApplication");
