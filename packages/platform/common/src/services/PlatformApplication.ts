import {Inject, Injectable, ProviderScope} from "@tsed/di";
import {IncomingMessage, ServerResponse} from "http";
import {PlatformAdapter} from "./PlatformAdapter";
import {PlatformHandler} from "./PlatformHandler";
import {PlatformRouter} from "./PlatformRouter";

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

  constructor(adapter: PlatformAdapter<App, Router>, platformHandler: PlatformHandler) {
    super(adapter, platformHandler, {});
    this.raw = this.rawApp = (adapter.createApp() as unknown) as App;
  }

  callback(): (req: IncomingMessage, res: ServerResponse) => any {
    return this.adapter.callback(this.rawApp);
  }

  getApp(): App {
    return this.rawApp;
  }
}
