import {registerProvider} from "@tsed/di";
import {Server} from "socket.io";

export type SocketIOServer = Server;

// tslint:disable-next-line: variable-name
export const SocketIOServer = Server;

export {Server};

registerProvider({
  provide: Server,
  useFactory() {
    return new Server();
  }
});
