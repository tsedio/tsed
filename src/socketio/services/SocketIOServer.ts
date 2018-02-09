import * as SocketIO from "socket.io";
import {InjectorService} from "@tsed/common";

/**
 * @experimental
 */
export interface SocketIOServer extends SocketIO.Server {
}

/**
 * @experimental
 */
export const SocketIOServer = Symbol("SocketIOServer");

InjectorService.factory(SocketIOServer, SocketIO());