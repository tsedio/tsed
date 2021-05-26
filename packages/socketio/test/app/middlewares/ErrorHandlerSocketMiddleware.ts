import {Socket, SocketErr, SocketMiddlewareError} from "@tsed/socketio";

@SocketMiddlewareError()
export class ErrorHandlerSocketMiddleware {
  async use(@SocketErr err: any, @Socket socket: Socket) {
    socket.emit("eventErr", {message: "An error has occurred"});
  }
}
