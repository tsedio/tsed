import {IncomingMessage, ServerResponse} from "node:http";

import {injectable, ProviderScope} from "@tsed/di";
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
  rawApp: App;

  rawCallback(): any {}

  getApp(): App {
    return this.rawApp;
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
