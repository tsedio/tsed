import {constant, injectable} from "@tsed/di";
import {Server, type ServerOptions} from "socket.io";

export type SocketIOServer = Server;

// tslint:disable-next-line: variable-name
export const SocketIOServer = Server;

injectable(Server).factory(() => {
  const socketIO = constant<Partial<ServerOptions>>("socketIO");

  return new Server(socketIO);
});

export {Server};
