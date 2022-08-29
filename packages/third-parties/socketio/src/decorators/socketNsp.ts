import {Namespace} from "./nsp";
import {SocketFilters} from "../interfaces/SocketFilters";
import {SocketFilter} from "./socketFilter";

export type SocketNsp = Namespace;

export function SocketNsp(target: any, propertyKey: string, index: number): any {
  return SocketFilter(SocketFilters.SOCKET_NSP)(target, propertyKey, index);
}
