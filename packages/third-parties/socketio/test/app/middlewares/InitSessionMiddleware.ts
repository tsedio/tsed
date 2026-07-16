import {IUser} from "../models/User.js";
import {Middleware} from "@tsed/platform-middlewares";
import {Request} from "@tsed/platform-http";

declare global {
  namespace Express {
    interface Session {
      user: IUser;
    }
  }
}

@Middleware()
export class InitSessionMiddleware {
  use(@Request() request: Express.Request) {
    if (request.session) {
      (request.session as any).user = (request.session as any).user || {};
    }
  }
}
