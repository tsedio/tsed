import {Inject} from "@tsed/di";
import {Type} from "@tsed/core";
import {Server} from "../services/SocketIOServer";

/**
 * Inject the [SocketIO.Server](https://socket.io/docs/server-api/) instance in the decorated parameter.
 *
 * ### Example
 *
 * ```typescript
 * @SocketService("/nsp")
 * export class MyWS {
 *   constructor(@IO private io: Server) {}
 * }
 * ```
 *
 * @param target
 * @param targetKey
 * @param descriptor
 * @decorator
 */
export function IO(): (...args: any[]) => any;
export function IO(target: Type<any>, targetKey: string, descriptor: TypedPropertyDescriptor<Function> | number): any;
export function IO(target?: Type<any>, targetKey?: string, descriptor?: TypedPropertyDescriptor<Function> | number): any {
  if (target) {
    return Inject(Server)(target, targetKey, descriptor);
  }
  return Inject(Server);
}
