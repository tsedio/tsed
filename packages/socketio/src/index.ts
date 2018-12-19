import * as SocketIO from "socket.io";

declare module "@tsed/common" {
  interface IServerSettingsOptions {
    socketIO: SocketIO.ServerOptions;
  }
}

// interfaces
export * from "./interfaces/OnNamespaceInit";

// decorators
export * from "./decorators/input";
export * from "./decorators/args";
export * from "./decorators/io";
export * from "./decorators/nsp";
export * from "./decorators/emit";
export * from "./decorators/broadcast";
export * from "./decorators/broadcastOthers";
export * from "./decorators/inputAndEmit";
export * from "./decorators/inputAndBroadcast";
export * from "./decorators/inputAndBroadcastOthers";
export * from "./decorators/socket";
export * from "./decorators/socketErr";
export * from "./decorators/socketFilter";
export * from "./decorators/socketMiddleware";
export * from "./decorators/socketMiddlewareError";
export * from "./decorators/socketService";
export * from "./decorators/socketSession";
export * from "./decorators/socketUseAfter";
export * from "./decorators/socketUseBefore";
export * from "./decorators/socketEventName";

// service
export * from "./services/SocketIOServer";
export * from "./services/SocketIOService";
