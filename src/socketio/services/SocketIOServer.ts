import {registerFactory} from "@tsed/common";
import * as SocketIO from "socket.io";

/**
 * @experimental
 */
export interface SocketIOServer extends SocketIO.Server {
}

/**
 * @experimental
 */
export const SocketIOServer = Symbol("SocketIOServer");

registerFactory(SocketIOServer, SocketIO());