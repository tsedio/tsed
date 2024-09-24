import {Args, SocketMiddleware, SocketSession} from "../../..";

@SocketMiddleware()
export class AuthSocketMiddleware {
  use(@Args() args: any[], @SocketSession session: Map<string, any>) {
    const [user] = args;
    // update Arguments
    user.auth = "true";

    return [user];
  }
}
