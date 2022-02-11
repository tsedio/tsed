import {getClass, nameOf} from "@tsed/core";
import {Socket as IOSocket, Server, Namespace} from "socket.io";
import {Args, Emit, Input, IO, Nsp, Socket, SocketService, SocketSession, SocketUseAfter, SocketUseBefore} from "@tsed/socketio";
import {ConverterUserSocketMiddleware} from "../middlewares/ConverterUserSocketMiddleware";
import {ErrorHandlerSocketMiddleware} from "../middlewares/ErrorHandlerSocketMiddleware";
import {AuthSocketMiddleware} from "../middlewares/AuthSocketMiddleware";
import {User} from "../models/User";

@SocketService("/room")
@SocketUseBefore(AuthSocketMiddleware)
@SocketUseAfter(ErrorHandlerSocketMiddleware)
export class RoomWS {
  // tslint:disable-next-line: no-unused-variable
  constructor(@IO private io: Server) {}

  $onConnection(socket: IOSocket, nsp: Namespace) {
    console.log("connection1");
  }

  $onDisconnect(socket: IOSocket, nsp: Namespace) {
    console.log("disconnect1");
  }

  @Input("eventName")
  @Emit("eventTest")
  @SocketUseBefore(ConverterUserSocketMiddleware)
  async myMethod(@SocketSession session: Map<any, any>) {
    console.log("session", session.get("test"));

    return "my Message " + session.get("test");
  }

  @Input("eventUser")
  @Emit("eventUserReturn")
  user(
    @Args(0)
    user: User,
    @SocketSession session: Map<any, any>
  ): User {
    console.log("user", nameOf(getClass(user)), user);

    return user;
  }

  @Input("eventError")
  @Emit("eventTest")
  @SocketUseAfter(ErrorHandlerSocketMiddleware)
  async myError(
    @Args(0)
    userName: string,
    @Socket socket: IOSocket,
    @Nsp nsp: Namespace
  ) {
    throw new Error("Error");

    // return "my Message " + userName;
  }

  @Input("eventError2")
  @Emit("eventTest")
  async myError2(
    @Args(0)
    userName: string,
    @Socket socket: IOSocket,
    @Nsp nsp: Namespace
  ) {
    return "my Message " + userName;
    // return "my Message " + userName;
  }
}

@SocketService("/room")
@SocketUseAfter(ErrorHandlerSocketMiddleware)
export class RoomWS2 {
  $onConnection(socket: IOSocket, nsp: Namespace) {
    console.log("connection2");
  }

  $onDisconnect(socket: IOSocket, nsp: Namespace) {
    console.log("disconnect2");
  }
}

@SocketService("/room")
@SocketUseAfter(ErrorHandlerSocketMiddleware)
export class RoomWS3 {
  $onConnection(socket: Socket, nsp: Namespace) {}

  $onDisconnect(socket: Socket, nsp: Namespace) {}
}

@SocketService("/room")
@SocketUseAfter(ErrorHandlerSocketMiddleware)
export class RoomWS4 {
  $onConnection(socket: Socket, nsp: Namespace) {}

  $onDisconnect(socket: Socket, nsp: Namespace) {}
}

@SocketService("/room")
@SocketUseAfter(ErrorHandlerSocketMiddleware)
export class RoomWS5 {
  $onConnection(socket: Socket, nsp: Namespace) {}

  $onDisconnect(socket: Socket, nsp: Namespace) {}
}

@SocketService("/room")
@SocketUseAfter(ErrorHandlerSocketMiddleware)
export class RoomWS6 {
  $onConnection(socket: Socket, nsp: Namespace) {}

  $onDisconnect(socket: Socket, nsp: Namespace) {}
}

@SocketService("/room")
@SocketUseAfter(ErrorHandlerSocketMiddleware)
export class RoomWS8 {
  $onConnection(socket: Socket, nsp: Namespace) {}

  $onDisconnect(socket: Socket, nsp: Namespace) {}
}

@SocketService("/room")
@SocketUseAfter(ErrorHandlerSocketMiddleware)
export class RoomWS9 {
  $onConnection(socket: Socket, nsp: Namespace) {}

  $onDisconnect(socket: Socket, nsp: Namespace) {}
}

@SocketService("/room")
@SocketUseAfter(ErrorHandlerSocketMiddleware)
export class RoomWS10 {
  $onConnection(socket: Socket, nsp: Namespace) {}

  $onDisconnect(socket: Socket, nsp: Namespace) {}
}
