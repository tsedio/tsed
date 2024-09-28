import {Socket, SocketErr, SocketMiddlewareError} from "../../..";

@SocketMiddlewareError()
export class ErrorHandlerSocketMiddleware {
  use(@SocketErr err: any, @Socket socket: Socket) {
    socket.emit("eventErr", {message: "An error has occurred"});
  }
}
