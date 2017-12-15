import {Store} from "../../core";

/**
 * Attach the decorated method to the socket event.
 *
 * ### Example
 *
 * ```typescript
 * @SocketService("/nsp")
 * export class MyWS {
 *
 *   @Input("event")
 *   myMethod(@Args(0) data: any, @Nsp socket) {
 *
 *   }
 * }
 * ```
 *
 * @experimental
 * @decorator
 * @param eventName
 */
export function Input(eventName: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        Store.from(target).merge("socketIO", {
            handlers: {
                [propertyKey]: {
                    eventName,
                    methodClassName: propertyKey
                }
            }
        });
    };
}