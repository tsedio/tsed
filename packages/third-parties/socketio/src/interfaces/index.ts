import SocketIO from "socket.io";

declare global {
  namespace TsED {
    interface Configuration {
      socketIO: Partial<SocketIO.ServerOptions>;
    }
  }
}

export * from "./SocketHandlerMetadata";
export * from "./SocketParamMetadata";
export * from "./SocketProviderTypes";
export * from "./OnNamespaceInit";
export * from "./SocketFilters";
export * from "./SocketReturnsTypes";
export * from "./SocketInjectableNsp";
