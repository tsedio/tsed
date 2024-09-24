import {Req} from "@tsed/common";
import {Arg, OnVerify, Protocol} from "@tsed/passport";
import {ExtractJwt, Strategy, StrategyOptions} from "passport-jwt";

import {AuthService} from "../services/auth/AuthService";

@Protocol<StrategyOptions>({
  name: "jwt",
  useStrategy: Strategy,
  settings: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "secret",
    issuer: "accounts.examplesoft.com",
    audience: "yoursite.net"
  }
})
export class JwtProtocol implements OnVerify {
  constructor(private authService: AuthService) {}

  async $onVerify(@Req() req: Req, @Arg(0) jwtPayload: any) {
    const user = await this.authService.findOne({id: jwtPayload.sub});

    return user ? user : false;
  }
}
