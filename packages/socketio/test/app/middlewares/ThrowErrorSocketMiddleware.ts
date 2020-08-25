import {Args} from "@tsed/socketio";
import {SocketMiddleware} from "@tsed/socketio";

@SocketMiddleware()
export class ThrowErrorSocketMiddleware {
  use(@Args(0) userName: string[]) {
    throw new Error("Test");
  }
}
