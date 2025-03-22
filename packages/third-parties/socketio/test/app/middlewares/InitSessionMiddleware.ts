import {Request} from "@tsed/platform-http";
import {Middleware} from "@tsed/platform-middlewares";

import {IUser} from "../models/User.js";

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
