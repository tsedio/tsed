import {isArray} from "@tsed/core";
import {Context} from "@tsed/platform-params";
import {Inject} from "@tsed/di";
import {Middleware} from "@tsed/platform-middlewares";
import {ProtocolsService} from "../services/ProtocolsService.js";
import {getProtocolsFromRequest} from "../utils/getProtocolsFromRequest.js";
import {getSessionProtocol, hasLoginSession} from "../utils/sessionProtocol.js";

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
   * - the endpoint accepts the reserved `"session"` protocol and the request carries a persisted login session,
   * - or the persisted login session was established by one of the endpoint protocols.
   *
   * A session established by another protocol never satisfies the endpoint: its strategies run instead.
   */
  shouldSkip(protocol: string | string[], protocols: string[], ctx: Context) {
    const request = ctx.getRequest();

    if (!(request.user && request.isAuthenticated?.())) {
      return false;
    }

    const acceptsAny = isArray(protocol) ? protocol.includes("*") : protocol === "*";

    if (acceptsAny) {
      return true;
    }

    // The session rules require a persisted login session, not only a user set by a stateless strategy.
    if (!hasLoginSession(request)) {
      return false;
    }

    const sessionProtocol = getSessionProtocol(request);

    return protocols.includes(SESSION_PROTOCOL) || (!!sessionProtocol && protocols.includes(sessionProtocol));
  }

  async use(@Context() ctx: Context) {
    const endpoint = ctx.endpoint;
    const request = ctx.getRequest();
    const {options, protocol, method, originalUrl = true} = endpoint.store.get(PassportMiddleware);
    const protocols = getProtocolsFromRequest(request, protocol, this.protocolsService.getProtocolsNames());

    if (this.shouldSkip(protocol, protocols, ctx)) {
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
