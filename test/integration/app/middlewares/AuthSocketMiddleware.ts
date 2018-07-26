import {Args, SocketSession} from "../../../../src/socketio";
import {SocketMiddleware} from "../../../../src/socketio/decorators/socketMiddleware";

@SocketMiddleware()
export class AuthSocketMiddleware {
  use(@Args() args: any[], @SocketSession session: Map<string, any>) {
    const [user] = args;
    // update Arguments
    user.auth = "true";

    return [user];
  }
}
