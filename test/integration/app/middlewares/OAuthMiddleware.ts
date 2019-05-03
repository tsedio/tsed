import {AuthenticatedMiddleware, EndpointInfo, EndpointMetadata, Middleware, Req} from "@tsed/common";
import * as Express from "express";
import {BadRequest, Forbidden, Unauthorized} from "ts-httpexceptions";
import {TokenService} from "../services/TokenService";

@Middleware()
export class OAuthMiddleware {
  constructor(private tokenService: TokenService) {
  }

  public use(
    @EndpointInfo() endpoint: EndpointMetadata,
    @Req() request: Express.Request
  ) {
    const options = endpoint.get(OAuthMiddleware) || {};

    if (!request.get("authorization")) {
      throw new Unauthorized("Unauthorized");
    }

    if (!this.tokenService.isValid(request.get("authorization"))) {
      throw new BadRequest("Bad token format");
    }

    if (options && options.role === "admin" && request.get("authorization") !== "token-admin") {
      throw new Forbidden("Forbidden");
    }
  }
}
