import {PlatformApplication, PlatformBuilder, PlatformHandler, PlatformRequest, PlatformResponse, PlatformRouter} from "@tsed/common";
import {Type} from "@tsed/core";
import {
  PlatformExpressApplication,
  PlatformExpressHandler,
  PlatformExpressRequest,
  PlatformExpressResponse,
  PlatformExpressRouter
} from "../services";

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
    },
    {
      provide: PlatformRequest,
      useClass: PlatformExpressRequest
    }
  ];

  static async bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}): Promise<PlatformExpress> {
    return this.build<PlatformExpress>(PlatformExpress).bootstrap(module, settings);
  }
}
