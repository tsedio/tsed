import {Req} from "@tsed/common";
import {Arg, OnVerify, PassportMiddleware, Protocol} from "@tsed/passport";
import {BearerStrategy, ITokenPayload} from "passport-azure-ad";
import {AuthService} from "../services/auth/AuthService";

@Protocol({
  name: "azure-bearer",
  useStrategy: BearerStrategy
})
export class AzureBearerProtocol implements OnVerify {
  constructor(private authService: AuthService) {
  }

  $onVerify(@Req() req: Req, @Arg(0) token: ITokenPayload) {
    // Verify is the right place to check given token and return UserInfo
    const {authService} = this;
    const {options = {}} = req.ctx.endpoint.get(PassportMiddleware) || {}; // retrieve options configured for the endpoint
    // check precondition and authenticate user by their token and given options
    try {
      const user = authService.verify(token, options);

      if (!user) {
        authService.add(token);
        req.ctx.logger.info({event: "BearerStrategy - token: ", token});

        return token;
      }

      req.ctx.logger.info({event: "BearerStrategy - user: ", token});

      return [user, token];
    } catch (error) {
      req.ctx.logger.error({event: "BearerStrategy", token, error});
      throw error;
    }
  }
}
