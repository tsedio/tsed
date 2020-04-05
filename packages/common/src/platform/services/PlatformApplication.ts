import {Configuration, Injectable, ProviderScope} from "@tsed/di";
import * as Express from "express";
import {PlatformDriver} from "./PlatformDriver";
import {PlatformHandler} from "./PlatformHandler";

/**
 * `PlatformApplication` is used to provide all routes collected by annotation `@Controller`.
 */
@Injectable({
  scope: ProviderScope.SINGLETON
})
export class PlatformApplication extends PlatformDriver<Express.Application> {
  constructor(platformHandler: PlatformHandler, @Configuration() configuration: Configuration) {
    super(platformHandler);
    this.raw = Express();
  }

  callback() {
    return this.raw;
  }
}
