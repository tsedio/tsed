import {Arg, OnVerify, PassportMiddleware, Protocol} from "@tsed/passport";
import {Context} from "@tsed/platform-params";
import {BearerStrategy, ITokenPayload} from "passport-azure-ad";

import {AuthService} from "../services/auth/AuthService";

@Protocol({
  name: "azure-bearer",
  useStrategy: BearerStrategy
})
export class AzureBearerProtocol implements OnVerify {
  constructor(private authService: AuthService) {}

  $onVerify(@Arg(0) token: ITokenPayload, @Context() ctx: Context) {
    // Verify is the right place to check given token and return UserInfo
    const {authService} = this;
    const {options = {}} = ctx.endpoint.get(PassportMiddleware) || {}; // retrieve options configured for the endpoint
    // check precondition and authenticate user by their token and given options
    try {
      const user = authService.verify(token, options);

      if (!user) {
        authService.add(token);
        ctx.logger.info({event: "BearerStrategy - token: ", token});

        return token;
      }

      ctx.logger.info({event: "BearerStrategy - user: ", token});

      return [user, token];
    } catch (error) {
      ctx.logger.error({event: "BearerStrategy", token, error});
      throw error;
    }
  }
}
