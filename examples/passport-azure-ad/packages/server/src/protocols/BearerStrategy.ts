import {$log, Req, Configuration} from "@tsed/common";
import {registerFactory} from "@tsed/di";
import {AuthService} from "../services/auth/AuthService";
import {BearerStrategy, ITokenPayload, VerifyCallback} from "passport-azure-ad";
import * as Passport from "passport";

export const OAuthBearerOptions = Symbol.for("OAuthBearerOptions");

registerFactory({
  provide: BearerStrategy,
  deps: [AuthService, Configuration],
  useFactory: (authService: AuthService, settings: Configuration) => {
    const verifier = async (req: Req, token: ITokenPayload, done: VerifyCallback) => {
      // Verify is the right place to check given token and return userinfo
      try {
        const options = req.ctx.endpoint.get(OAuthBearerOptions) || {}; // retrieve options configured for the endpoint
        // check precondition and authenticate user by their token and given options
        try {
          const user = authService.verify(token, options);

          if (!user) {
            authService.add(token);
            $log.info({event: "BearerStrategy - token: ", token});
            return done(null, token);
          }

          $log.info({event: "BearerStrategy - user: ", token});
          return done(null, user, token);
        } catch (error) {
          $log.error({event: "BearerStrategy", token, error});
          return done(error);
        }
      } catch (error) {
        return done(error);
      }
    };

    const strategy = new BearerStrategy({
      ...settings.get("azureBearerOptions"),
      passReqToCallback: true  // !!!! IMPORTANT
    }, verifier);

    Passport.use(strategy);

    return strategy;
  }
});

