import {OverrideProvider} from "@tsed/di";
import * as Express from "express";
import {PlatformApplication} from "../../platform/services/PlatformApplication";
import {PlatformHandler} from "../../platform/services/PlatformHandler";

declare global {
  namespace TsED {
    export interface Application extends Express.Application {}
  }
}

/**
 * @platform
 * @express
 */
@OverrideProvider(PlatformApplication)
export class PlatformExpressApplication extends PlatformApplication {
  constructor(platformHandler: PlatformHandler) {
    super(platformHandler);
    this.raw = Express();
  }
}
