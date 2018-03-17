import {registerFactory} from "@tsed/common";
import * as SocketIO from "socket.io";

/**
 *
 */
export interface SocketIOServer extends SocketIO.Server {
}

/**
 *
 */
export const SocketIOServer = Symbol("SocketIOServer");

registerFactory(SocketIOServer, SocketIO());