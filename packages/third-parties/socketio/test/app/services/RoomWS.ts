import {getClass, nameOf} from "@tsed/core";
import {Namespace, Server, Socket as IOSocket} from "socket.io";

import {Args, Emit, Input, IO, Nsp, Socket, SocketService, SocketSession, SocketUseAfter, SocketUseBefore} from "../../../src/index.js";
import {AuthSocketMiddleware} from "../middlewares/AuthSocketMiddleware.js";
import {ConverterUserSocketMiddleware} from "../middlewares/ConverterUserSocketMiddleware.js";
import {ErrorHandlerSocketMiddleware} from "../middlewares/ErrorHandlerSocketMiddleware.js";
import {User} from "../models/User.js";

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
  myMethod(@SocketSession session: SocketSession) {
    console.log("session", session.get("test"));

    return Promise.resolve("my Message " + session.get("test"));
  }

  @Input("eventUser")
  @Emit("eventUserReturn")
  user(
    @Args(0)
    user: User
  ): User {
    console.log("user", nameOf(getClass(user)), user);

    return user;
  }

  @Input("eventError")
  @Emit("eventTest")
  @SocketUseAfter(ErrorHandlerSocketMiddleware)
  myError(
    @Args(0)
    userName: string,
    @Socket socket: IOSocket,
    @Nsp nsp: Namespace
  ) {
    return Promise.reject(new Error("Error"));

    // return "my Message " + userName;
  }

  @Input("eventError2")
  @Emit("eventTest")
  myError2(
    @Args(0)
    userName: string,
    @Socket socket: IOSocket,
    @Nsp nsp: Namespace
  ) {
    return Promise.resolve("my Message " + userName);
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
