import {PlatformApplication, PlatformBuilder, PlatformHandler, PlatformResponse, PlatformRouter} from "@tsed/common";
import {Type} from "@tsed/core";
import {PlatformExpressApplication} from "../services/PlatformExpressApplication";
import {PlatformExpressHandler} from "../services/PlatformExpressHandler";
import {PlatformExpressResponse} from "../services/PlatformExpressResponse";
import {PlatformExpressRouter} from "../services/PlatformExpressRouter";

/**
 * @platform
 * @express
 */
export class PlatformExpress extends PlatformBuilder {
  static providers = [
    {
      provide: PlatformApplication,
      useClass: PlatformExpressApplication
    },
    {
      provide: PlatformRouter,
      useClass: PlatformExpressRouter
    },
    {
      provide: PlatformHandler,
      useClass: PlatformExpressHandler
    },
    {
      provide: PlatformResponse,
      useClass: PlatformExpressResponse
    }
  ];

  static async bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}): Promise<PlatformExpress> {
    return this.build<PlatformExpress>(PlatformExpress).bootstrap(module, settings);
  }
}
