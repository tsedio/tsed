import {Inject} from "@tsed/common";
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
export function IO(target: Type<any>, targetKey: string, descriptor?: TypedPropertyDescriptor<Function> | number) {
  return Inject(Server)(target, targetKey, descriptor);
}
