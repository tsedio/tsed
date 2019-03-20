import {ProviderScope, registerProvider} from "@tsed/common";
import * as SocketIO from "socket.io";

/**
 *
 */
export interface SocketIOServer extends SocketIO.Server {}

/**
 *
 */
// tslint:disable-next-line: variable-name
export const SocketIOServer = Symbol("SocketIOServer");

registerProvider({
  provide: SocketIOServer,
  scope: ProviderScope.SINGLETON,
  useFactory() {
    return SocketIO();
  }
});
