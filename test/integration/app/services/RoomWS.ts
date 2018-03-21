import {
    Args,
    Emit,
    Input,
    IO,
    Nsp,
    Socket,
    SocketService,
    SocketSession,
    SocketUseAfter,
    SocketUseBefore
} from "@tsed/socketio";
import {ConverterUserSocketMiddleware} from "../middlewares/ConverterUserSocketMiddleware";
import {ErrorHandlerSocketMiddleware} from "../middlewares/ErrorHandlerSocketMiddleware";

@SocketService("/room")
@SocketUseAfter(ErrorHandlerSocketMiddleware)
export class RoomWS {
    constructor(@IO private io: SocketIO.Server) {

    }

    $onConnection(socket: SocketIO.Socket, nsp: SocketIO.Namespace) {

    }

    $onDisconnect(socket: SocketIO.Socket, nsp: SocketIO.Namespace) {

    }

    @Input("eventName")
    @Emit("eventTest")
    @SocketUseBefore(ConverterUserSocketMiddleware)
    async myMethod(@SocketSession session: Map<any, any>) {
        console.log("session", session.get("test"));
        return "my Message " + session.get("test");
    }

    @Input("eventError")
    @Emit("eventTest")
    @SocketUseAfter(ErrorHandlerSocketMiddleware)
    async myError(@Args(0) userName: string, @Socket socket: SocketIO.Socket, @Nsp nsp: SocketIO.Namespace) {

        throw new Error("Error");

        // return "my Message " + userName;
    }

    @Input("eventError2")
    @Emit("eventTest")
    async myError2(@Args(0) userName: string, @Socket socket: SocketIO.Socket, @Nsp nsp: SocketIO.Namespace) {
        return "my Message " + userName;
        // return "my Message " + userName;
    }
}