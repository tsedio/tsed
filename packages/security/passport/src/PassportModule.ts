import {BeforeRoutesInit, Constant, Inject, Module, OnInit, PlatformApplication, Provider, ProviderScope, Logger} from "@tsed/common";
import Passport from "passport";
import {PassportSerializerService} from "./services/PassportSerializerService";
import {ProtocolsService} from "./services/ProtocolsService";

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

  @Constant("PLATFORM_NAME")
  platformName: string;

  @Inject()
  logger: Logger;

  constructor(
    private app: PlatformApplication,
    private protocolsService: ProtocolsService,
    private passportSerializer: PassportSerializerService
  ) {}

  $onInit(): Promise<any> | void {
    Passport.serializeUser(this.passportSerializer.serialize.bind(this.passportSerializer));
    Passport.deserializeUser(this.passportSerializer.deserialize.bind(this.passportSerializer));

    this.protocolsService.getProtocols().forEach((provider: Provider<any>) => this.protocolsService.invoke(provider));

    return undefined;
  }

  $beforeRoutesInit(): void | Promise<any> {
    const {userProperty, pauseStream} = this;
    switch (this.platformName) {
      case "express":
        this.app.use(Passport.initialize({userProperty}));
        this.app.use(Passport.session({pauseStream}));

        return;

      default:
        this.logger.warn(`Platform "${this.platformName}" not supported by @tsed/passport`);
    }
  }
}
