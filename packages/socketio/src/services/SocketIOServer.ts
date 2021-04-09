import {registerFactory} from "@tsed/common";
import {Server} from "socket.io";

export type SocketIOServer = Server;

// tslint:disable-next-line: variable-name
export const SocketIOServer = Server;

export {Server};

registerFactory({
  provide: Server,
  useFactory() {
    return new Server();
  }
});
