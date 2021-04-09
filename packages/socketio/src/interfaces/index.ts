import SocketIO from "socket.io";

declare global {
  namespace TsED {
    interface Configuration {
      socketIO: SocketIO.ServerOptions;
    }
  }
}

export * from "./SocketHandlerMetadata";
export * from "./ISocketMiddlewareHandlerMetadata";
export * from "./SocketParamMetadata";
export * from "./SocketProviderMetadata";
export * from "./OnNamespaceInit";
export * from "./SocketFilters";
export * from "./SocketReturnsTypes";
