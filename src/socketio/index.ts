import * as SocketIO from "socket.io";

declare interface IServerSettings {
    socketIO?: SocketIO.ServerOptions;
}

// interfaces
export * from "./interfaces/OnNamespaceInit";

// decorators
export * from "./decorators/socketService";
export * from "./decorators/input";
export * from "./decorators/args";
export * from "./decorators/io";
export * from "./decorators/nsp";
export * from "./decorators/socket";
export * from "./decorators/socketSession";
export * from "./decorators/emit";
export * from "./decorators/broadcast";
export * from "./decorators/broadcastOthers";
export * from "./decorators/inputAndEmit";
export * from "./decorators/inputAndBroadcast";
export * from "./decorators/inputAndBroadcastOthers";

// service
export * from "./services/SocketIOServer";
export * from "./services/SocketIOService";

