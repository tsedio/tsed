import {Injectable, ProviderScope} from "@tsed/di";
import {PlatformMulterSettings} from "../../config/interfaces/PlatformMulterSettings";
import {IncomingMessage, ServerResponse} from "http";
import {getMulter} from "../utils/getMulter";
import {createFakeRawDriver} from "./FakeRawDriver";
import {PlatformRouter} from "./PlatformRouter";

declare global {
  namespace TsED {
    // @ts-ignore
    export interface Application {
      (req: IncomingMessage, res: ServerResponse): void;
    }
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
export class PlatformApplication<App = TsED.Application, Router = App> extends PlatformRouter {
  raw: App;
  rawRouter: Router;

  constructor() {
    super();

    this.raw = this.rawRouter = createFakeRawDriver();
  }

  get rawApp() {
    return this.raw;
  }

  getApp(): App {
    return this.raw;
  }

  getRouter(): Router {
    return this.rawRouter;
  }

  callback(): App {
    return this.raw;
  }

  getMulter(options: PlatformMulterSettings) {
    return getMulter(options);
  }
}
