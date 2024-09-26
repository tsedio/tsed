import {
  type BeforeRoutesInit,
  Constant,
  Inject,
  Logger,
  Module,
  type OnInit,
  PlatformApplication,
  type Provider,
  ProviderScope
} from "@tsed/common";
import Passport from "passport";

import {PassportSerializerService} from "./services/PassportSerializerService.js";
import {ProtocolsService} from "./services/ProtocolsService.js";

/**
 * @ignore
 */
@Module({
  scope: ProviderScope.SINGLETON
})
export class PassportModule implements OnInit, BeforeRoutesInit {
  @Constant("passport.userProperty")
  userProperty: string;

  @Constant("passport.pauseStream")
  pauseStream: boolean;

  @Constant("passport.disableSession", false)
  disableSession: boolean;

  @Constant("PLATFORM_NAME")
  platformName: string;

  @Inject(Logger)
  logger: Logger;

  @Inject(PlatformApplication)
  private app: PlatformApplication;

  @Inject(ProtocolsService)
  private protocolsService: ProtocolsService;

  @Inject(PassportSerializerService)
  private passportSerializer: PassportSerializerService;

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
