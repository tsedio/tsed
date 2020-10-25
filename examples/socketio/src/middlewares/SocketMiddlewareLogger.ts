import {$log} from "@tsed/logger";
import {Args, SocketMiddleware} from "@tsed/socketio";

@SocketMiddleware()
export class SocketMiddlewareLogger {
  async use(@Args() args: any[]) {
    $log.debug("Socket", args);

    return args;
  }
}
