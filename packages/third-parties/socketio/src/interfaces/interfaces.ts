import type SocketIO from "socket.io";

declare global {
  namespace TsED {
    interface Configuration {
      socketIO: Partial<SocketIO.ServerOptions>;
    }
  }
}
