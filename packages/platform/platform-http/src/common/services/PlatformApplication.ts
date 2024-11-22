import {inject, injectable, ProviderScope} from "@tsed/di";
import {PlatformRouter} from "@tsed/platform-router";
import {IncomingMessage, ServerResponse} from "http";

import {PlatformMulterSettings} from "../config/interfaces/PlatformMulterSettings.js";
import {PlatformAdapter} from "./PlatformAdapter.js";

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
  adapter: PlatformAdapter<App> = inject(PlatformAdapter<App>);

  rawApp: App;
  rawCallback: () => any;

  constructor() {
    super();

    const {app, callback} = this.adapter.createApp();

    this.rawApp = app;
    this.rawCallback = callback;
  }

  getApp(): App {
    return this.rawApp;
  }

  multer(options: PlatformMulterSettings) {
    return this.adapter.multipart(options);
  }

  callback(): (req: IncomingMessage, res: ServerResponse) => any;
  callback(req: IncomingMessage, res: ServerResponse): any;
  callback(req?: IncomingMessage, res?: ServerResponse) {
    if (req && res) {
      return this.callback()(req, res);
    }

    return this.rawCallback();
  }
}

injectable(PlatformApplication).scope(ProviderScope.SINGLETON).alias("PlatformApplication");
