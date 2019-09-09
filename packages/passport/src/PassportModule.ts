import {BeforeRoutesInit, Constant, ExpressApplication, Module, OnInit, Provider, ProviderScope} from "@tsed/common";

import * as Passport from "passport";
import {ProtocolRegistry} from "./registries/ProtocolRegistries";
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
    @ExpressApplication private expressApplication: ExpressApplication,
    private protocolsService: ProtocolsService,
    private passportSerializer: PassportSerializerService
  ) {}

  $onInit(): Promise<any> | void {
    Passport.serializeUser(this.passportSerializer.serialize.bind(this.passportSerializer));
    Passport.deserializeUser(this.passportSerializer.deserialize.bind(this.passportSerializer));

    ProtocolRegistry.forEach((provider: Provider<any>) => this.protocolsService.invoke(provider));

    return undefined;
  }

  $beforeRoutesInit(): void | Promise<any> {
    const {userProperty, pauseStream} = this;
    this.expressApplication.use(Passport.initialize({userProperty}));
    this.expressApplication.use(Passport.session({pauseStream}));
  }
}
