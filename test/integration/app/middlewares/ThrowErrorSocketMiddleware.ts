import {Args} from "../../../../packages/socketio";
import {SocketMiddleware} from "../../../../packages/socketio/decorators/socketMiddleware";

@SocketMiddleware()
export class ThrowErrorSocketMiddleware {
  use(@Args(0) userName: string[]) {
    throw new Error("Test");
  }
}
