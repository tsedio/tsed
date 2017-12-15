import {SocketIOServer} from "../";
import {Type} from "../../core/interfaces";
import {Inject} from "../../di";

/**
 * Inject the [SocketIO.Server](https://socket.io/docs/server-api/) instance in the decorated parameter.
 *
 * ### Example
 *
 * ```typescript
 * @SocketService("/nsp")
 * export class MyWS {
 *   constructor(@IO private io: SocketIO.Server) {}
 * }
 * ```
 *
 * @experimental
 * @param target
 * @param targetKey
 * @param descriptor
 * @decorator
 */
export function IO(target: Type<any>, targetKey: string, descriptor: TypedPropertyDescriptor<Function> | number) {
    return Inject(SocketIOServer)(target, targetKey, descriptor);
}