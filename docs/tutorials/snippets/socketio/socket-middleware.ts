import {Socket, SocketErr, SocketEventName, SocketMiddlewareError} from "@tsed/socketio";

@SocketMiddlewareError()
export class ErrorHandlerSocketMiddleware {
  async use(@SocketEventName eventName: string, @SocketErr err: any, @Socket socket: Socket) {
    console.error(err);
    socket.emit("error", {message: "An error has occured"});
  }
}
