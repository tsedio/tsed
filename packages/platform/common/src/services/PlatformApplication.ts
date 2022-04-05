import {Injectable, ProviderScope} from "@tsed/di";
import {PlatformHandler} from "./PlatformHandler";
import {PlatformRouter} from "./PlatformRouter";
import {PlatformAdapter} from "./PlatformAdapter";

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
export class PlatformApplication<App = TsED.Application, Router = TsED.Router> extends PlatformRouter<App, Router> {
  raw: App;
  rawApp: App;
  declare rawRouter: Router;

  constructor(platformHandler: PlatformHandler, adapter: PlatformAdapter<App, Router>) {
    super(platformHandler, adapter);
    const {app, callback} = adapter.app();

    this.rawApp = this.raw = app;
    this.callback = callback;
  }

  getApp(): App {
    return this.raw;
  }
}
