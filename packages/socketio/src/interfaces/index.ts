import * as SocketIO from "socket.io";

declare global {
  namespace TsED {
    interface Configuration {
      socketIO: SocketIO.ServerOptions;
    }
  }
}

export * from "./ISocketHandlerMetadata";
export * from "./ISocketMiddlewareHandlerMetadata";
export * from "./ISocketParamMetadata";
export * from "./ISocketProviderMetadata";
export * from "./OnNamespaceInit";
export * from "./SocketFilters";
export * from "./SocketReturnsTypes";
