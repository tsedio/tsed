import {Constant, Inject, Module, type OnInit, Provider} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {BeforeRoutesInit, PlatformApplication} from "@tsed/platform-http";
import Passport from "passport";

import {PassportSerializerService} from "./services/PassportSerializerService.js";
import {ProtocolsService} from "./services/ProtocolsService.js";

/**
 * @ignore
 */
@Module()
export class PassportModule implements OnInit, BeforeRoutesInit {
  @Constant("passport.userProperty")
  userProperty: string;

  @Constant("passport.pauseStream")
  pauseStream: boolean;

  @Constant("passport.disableSession", false)
  disableSession: boolean;

  @Constant("PLATFORM_NAME")
  platformName: string;

  @Inject()
  logger: Logger;

  constructor(
    private app: PlatformApplication,
    private protocolsService: ProtocolsService,
    private passportSerializer: PassportSerializerService
  ) {}

  async $onInit(): Promise<any> {
    Passport.serializeUser(this.passportSerializer.serialize.bind(this.passportSerializer));
    Passport.deserializeUser(this.passportSerializer.deserialize.bind(this.passportSerializer));

    const promises = this.protocolsService.getProtocols().map((provider: Provider) => this.protocolsService.invoke(provider));

    await Promise.all(promises);
    return undefined;
  }

  $beforeRoutesInit(): void | Promise<any> {
    const {userProperty, pauseStream} = this;
    switch (this.platformName) {
      case "express":
        this.app.use(Passport.initialize({userProperty}));
        !this.disableSession && this.app.use(Passport.session({pauseStream}));

        return;

      default:
        this.logger.warn(`Platform "${this.platformName}" not supported by @tsed/passport`);
    }
  }
}
