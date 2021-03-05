import {Context, Inject, Middleware, PlatformContext} from "@tsed/common";
import {ancestorsOf} from "@tsed/core";
import {Exception, Unauthorized} from "@tsed/exceptions";
import Passport from "passport";
import {PassportException} from "../errors/PassportException";
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

    if (protocols.length === 0) {
      throw new Unauthorized("Not authorized");
    }

    if (originalUrl) {
      request.url = request.originalUrl;
    }

    await this.call(method, protocols, options, ctx);
  }

  protected catchError(er: any) {
    if (!ancestorsOf(er).includes(Error)) {
      throw new PassportException(er);
    }

    throw er;
  }

  private async call(method: any, protocols: string[], options: any, ctx: PlatformContext) {
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    try {
      options.failWithError = true;
      // @ts-ignore
      const middleware = Passport[method](protocols.length === 1 ? protocols[0] : protocols, options);

      await new Promise((resolve, reject) => {
        middleware(request, response, (err: any) => {
          err ? reject(err) : resolve(undefined);
        });
      });
    } catch (er) {
      this.catchError(er);
    }
  }
}
