import {EndpointInfo, Inject, Middleware, Req} from "@tsed/common";
import * as Passport from "passport";
import {ProtocolsService} from "../services/ProtocolsService";

@Middleware()
export class AuthenticateMiddleware {
  @Inject(ProtocolsService)
  protocolsService: ProtocolsService;

  use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo) {
    const {options} = endpoint.store.get(AuthenticateMiddleware);
    let {protocol} = endpoint.store.get(AuthenticateMiddleware);

    if (protocol === "*") {
      protocol = this.protocolsService.getProviderNames();
    }

    return Passport.authenticate(protocol, options);
  }
}
