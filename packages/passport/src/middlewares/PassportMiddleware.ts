import {EndpointInfo, Inject, Middleware, Req} from "@tsed/common";
import {Unauthorized} from "@tsed/exceptions";
import Passport from "passport";
import {ProtocolsService} from "../services/ProtocolsService";
import {getProtocolsFromRequest} from "../utils/getProtocolsFromRequest";

@Middleware()
export class PassportMiddleware {
  @Inject(ProtocolsService)
  protocolsService: ProtocolsService;

  use(@Req() request: any, @EndpointInfo() endpoint: EndpointInfo) {
    if (request.user && request.isAuthenticated()) {
      return;
    }

    const {options, protocol, method, originalUrl = true} = endpoint.store.get(PassportMiddleware);
    const protocols = getProtocolsFromRequest(request, protocol, this.protocolsService.getProtocolsNames());

    if (protocols.length === 0) {
      throw new Unauthorized("Not authorized");
    }

    if (originalUrl) {
      request.url = request.originalUrl;
    }

    // @ts-ignore
    return Passport[method](protocols.length === 1 ? protocols[0] : protocols, options);
  }
}
