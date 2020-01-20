import {BodyParams, Controller, ConverterService, Get, Post, Req, Status} from "@tsed/common";
import {Authenticate, Authorize} from "@tsed/passport";
import {Returns} from "@tsed/swagger";
import {User} from "../../entities/User";
import {Credentials} from "../../models/Credentials";
import {UserCreation} from "../../models/UserCreation";

@Controller("/auth")
export class PassportCtrl {

  constructor(private converterService: ConverterService) {
  }

  @Post("/login")
  @Authenticate("login")
  @Returns(User)
  login(@Req() req: Req, @BodyParams() credentials: Credentials) {
    // FACADE
    return req.user;
  }

  @Post("/signup")
  @Status(201)
  @Authenticate("signup")
  @Returns(User)
  signup(@Req() req: Req, @BodyParams() user: UserCreation) {
    // FACADE
    const u = this.converterService.serialize(req.user, {type: User});
    return u || req.user;
  }

  @Get("/userinfo")
  @Authenticate("basic", {security: ["auth:basic"]})
  @Returns(User)
  getUserInfo(@Req() req: Req): any {
    // FACADE
    return req.user;
  }


  @Get("/logout")
  logout(@Req() req: Req) {
    req.logout();
  }

  @Get("/connect/:protocol")
  @Authorize(":protocol")
  @Returns(User)
  connectProtocol(@Req() req: Req): any {
    // FACADE
    return req.user;
  }


  @Get("/connect/:protocol/callback")
  @Authorize(":protocol")
  @Returns(User)
  connectProtocolCallback(@Req() req: Req): any {
    // FACADE
    return req.user;
  }
}
