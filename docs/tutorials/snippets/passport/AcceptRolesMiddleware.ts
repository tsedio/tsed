import {Context, Middleware} from "@tsed/common";
import {Unauthorized} from "@tsed/exceptions";

@Middleware()
export class AcceptRolesMiddleware {
  use(@Context() ctx: Context) {
    const request = ctx.getReq() // get Raw Request object

    if (request.user && request.isAuthenticated()) {
      const roles = ctx.endpoint.get(AcceptRolesMiddleware);

      if (!roles.includes(request.user.role)) {
        throw new Unauthorized("Insufficient role");
      }
    }
  }
}
