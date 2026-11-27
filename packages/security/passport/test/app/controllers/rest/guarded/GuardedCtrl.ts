import {Controller} from "@tsed/di";
import {Req} from "@tsed/platform-http";
import {Get, Post} from "@tsed/schema";
import {Authorize} from "../../../../../src/index.js";

function describeRequest(req: any) {
  return {user: req.user?.email, account: req.account?.email};
}

@Controller("/guarded")
export class GuardedCtrl {
  @Get("/any")
  @Authorize()
  any(@Req() req: Req) {
    return describeRequest(req);
  }

  @Get("/basic")
  @Authorize("basic")
  basic(@Req() req: Req) {
    return describeRequest(req);
  }

  @Get("/jwt")
  @Authorize("jwt")
  jwt(@Req() req: Req) {
    return describeRequest(req);
  }

  @Post("/login")
  @Authorize("login")
  login(@Req() req: Req) {
    return describeRequest(req);
  }

  @Get("/session")
  @Authorize("session")
  session(@Req() req: Req) {
    return describeRequest(req);
  }

  @Get("/session-or-jwt")
  @Authorize(["session", "jwt"])
  sessionOrJwt(@Req() req: Req) {
    return describeRequest(req);
  }
}
