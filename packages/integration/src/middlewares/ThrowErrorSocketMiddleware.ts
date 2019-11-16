import {Args} from "../../../../packages/socketio/src";
import {SocketMiddleware} from "../../../../packages/socketio/src/decorators/socketMiddleware";

@SocketMiddleware()
export class ThrowErrorSocketMiddleware {
  use(@Args(0) userName: string[]) {
    throw new Error("Test");
  }
}
