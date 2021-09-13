import {Context, Inject, Middleware} from "@tsed/common";
import {ProtocolsService} from "../services/ProtocolsService";
import {getProtocolsFromRequest} from "../utils/getProtocolsFromRequest";

@Middleware()
export class PassportMiddleware {
  @Inject(ProtocolsService)
  protocolsService: ProtocolsService;

  shouldSkip(ctx: Context) {
    const request = ctx.getRequest();
    return request.user && request.isAuthenticated();
  }

  async use(@Context() ctx: Context) {
    const endpoint = ctx.endpoint;
    const request = ctx.getRequest();

    if (this.shouldSkip(ctx)) {
      return;
    }
    const {options, protocol, method, originalUrl = true} = endpoint.store.get(PassportMiddleware);
    const protocols = getProtocolsFromRequest(request, protocol, this.protocolsService.getProtocolsNames());

    if (originalUrl) {
      request.url = request.originalUrl;
    }

    await (method === "authenticate"
      ? this.protocolsService.authenticate(protocols, options, ctx)
      : this.protocolsService.authorize(protocols, options, ctx));
  }
}
