import {Middleware, Request} from "@tsed/common";
import {IUser} from "../models/User";

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
