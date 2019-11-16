import {Args, SocketSession} from "../../../../packages/socketio/src";
import {SocketMiddleware} from "../../../../packages/socketio/src/decorators/socketMiddleware";

@SocketMiddleware()
export class AuthSocketMiddleware {
  use(@Args() args: any[], @SocketSession session: Map<string, any>) {
    const [user] = args;
    // update Arguments
    user.auth = "true";

    return [user];
  }
}
