import {$log} from "ts-log-debug";
import {Socket, SocketErr} from "../../../../packages/socketio/src";
import {SocketMiddlewareError} from "../../../../packages/socketio/src/decorators/socketMiddlewareError";

@SocketMiddlewareError()
export class ErrorHandlerSocketMiddleware {
  async use(@SocketErr err: any, @Socket socket: SocketIO.Socket) {
    $log.error("===", err);
    socket.emit("eventErr", {message: "An error has occured"});
  }
}
