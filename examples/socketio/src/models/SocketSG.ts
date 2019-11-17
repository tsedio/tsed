import * as SocketIO from "socket.io";
import {PlayerSG} from "./PlayerSG";

export type SocketSG = SocketIO.Socket & {
  player: PlayerSG
};
