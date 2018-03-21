import {$log} from "ts-log-debug";
import {Socket, SocketErr} from "../../../../src/socketio";
import {SocketMiddlewareError} from "../../../../src/socketio/decorators/socketMiddlewareError";

@SocketMiddlewareError()
export class ErrorHandlerSocketMiddleware {
    async use(@SocketErr err: any, @Socket socket: SocketIO.Socket) {
        $log.error("===", err);
        socket.emit("eventErr", {message: "An error has occured"});
    }
}