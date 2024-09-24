import {Unauthorized} from "@tsed/exceptions";
import {Middleware} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";

@Middleware()
export class AcceptRolesMiddleware {
  use(@Context() ctx: Context) {
    const request = ctx.getReq();

    if (request.user && request.isAuthenticated()) {
      const roles = ctx.endpoint.get(AcceptRolesMiddleware);

      if (!roles.includes(request.user.role)) {
        throw new Unauthorized("Insufficient role");
      }
    }
  }
}
