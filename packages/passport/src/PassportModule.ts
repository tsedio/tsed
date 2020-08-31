import {BeforeRoutesInit, Constant, Module, OnInit, PlatformApplication, Provider, ProviderScope} from "@tsed/common";
import * as Passport from "passport";
import {PassportSerializerService} from "./services/PassportSerializerService";
import {ProtocolsService} from "./services/ProtocolsService";

@Module({
  scope: ProviderScope.SINGLETON
})
export class PassportModule implements OnInit, BeforeRoutesInit {
  @Constant("passport.userProperty")
  userProperty: string;

  @Constant("passport.pauseStream")
  pauseStream: boolean;

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
    this.app.use(Passport.initialize({userProperty}));
    this.app.use(Passport.session({pauseStream}));
  }
}
