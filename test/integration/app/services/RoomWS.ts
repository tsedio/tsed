import {Args, Emit, Input, IO, Nsp, Socket, SocketService, SocketUseAfter, SocketUseBefore} from "@tsed/socketio";
import {ConverterUserSocketMiddleware} from "../middlewares/ConverterUserSocketMiddleware";
import {ErrorHandlerSocketMiddleware} from "../middlewares/ErrorHandlerSocketMiddleware";
import {ThrowErrorSocketMiddleware} from "../middlewares/ThrowErrorSocketMiddleware";
import {User} from "../models/User";

@SocketService("/room")
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
    async myMethod(@Args(0) user: User, @Socket socket: SocketIO.Socket, @Nsp nsp: SocketIO.Namespace) {
        return "my Message " + user.name;
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
    @SocketUseBefore(ThrowErrorSocketMiddleware)
    @SocketUseAfter(ErrorHandlerSocketMiddleware)
    async myError2(@Args(0) userName: string, @Socket socket: SocketIO.Socket, @Nsp nsp: SocketIO.Namespace) {
        return "my Message " + userName;
        // return "my Message " + userName;
    }
}