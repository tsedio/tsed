import {isArray} from "@tsed/core";
import {Context} from "@tsed/platform-params";
import {Inject} from "@tsed/di";
import {Middleware} from "@tsed/platform-middlewares";
import {ProtocolsService} from "../services/ProtocolsService.js";
import {getProtocolsFromRequest} from "../utils/getProtocolsFromRequest.js";
import {getSessionProtocol} from "../utils/sessionProtocol.js";

/**
 * Reserved protocol name satisfied by an existing login session. It never runs a Passport strategy.
 */
export const SESSION_PROTOCOL = "session";

@Middleware()
export class PassportMiddleware {
  @Inject(ProtocolsService)
  protocolsService!: ProtocolsService;

  /**
   * Return true when an existing login session satisfies the protocols declared on the endpoint:
   *
   * - the endpoint accepts any protocol (`"*"`),
   * - the endpoint accepts the reserved `"session"` protocol,
   * - or the session was established by one of the endpoint protocols.
   *
   * A session established by another protocol never satisfies the endpoint: its strategies run instead.
   */
  shouldSkip(ctx: Context, protocol: string | string[], protocols: string[]) {
    const request = ctx.getRequest();

    if (!(request.user && request.isAuthenticated?.())) {
      return false;
    }

    const acceptsAny = isArray(protocol) ? protocol.includes("*") : protocol === "*";

    if (acceptsAny || protocols.includes(SESSION_PROTOCOL)) {
      return true;
    }

    const sessionProtocol = getSessionProtocol(request);

    return !!sessionProtocol && protocols.includes(sessionProtocol);
  }

  async use(@Context() ctx: Context) {
    const endpoint = ctx.endpoint;
    const request = ctx.getRequest();
    const {options, protocol, method, originalUrl = true} = endpoint.store.get(PassportMiddleware);
    const protocols = getProtocolsFromRequest(request, protocol, this.protocolsService.getProtocolsNames());

    if (this.shouldSkip(ctx, protocol, protocols)) {
      return;
    }

    // The session protocol has been checked above: it never runs a Passport strategy.
    const strategies = protocols.filter((name) => name !== SESSION_PROTOCOL);

    if (originalUrl) {
      request.url = request.originalUrl;
    }

    await (method === "authenticate"
      ? this.protocolsService.authenticate(strategies, options, ctx)
      : this.protocolsService.authorize(strategies, options, ctx));
  }
}
