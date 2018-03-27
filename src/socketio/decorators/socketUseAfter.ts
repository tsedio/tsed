import {Store, Type} from "@tsed/core";

/**
 * Attach a Socket Middleware to a method or a class.
 *
 * ### Example
 *
 * A middleware can be also used on a `SocketService` either on a class or on a method.
 *
 * Here an example of a middleware:
 *
 * ```typescript
 * import {SocketMiddlewareError, SocketErr, Socket, Args} from "@tsed/socketio";
 *
 * @SocketMiddlewareError()
 * export class ErrorHandlerSocketMiddleware {
 *    async use(@SocketErr() err: any, @Socket socket: SocketIO.Socket) {
 *        console.error(err);
 *        socket.emit("error", {message: "An error has occured"})
 *    }
 * }
 * ```
 *
 * Then:
 *
 * ```typescript
 * import {SocketService, SocketUseAfter, SocketUseBefore, Emit, Input, Args} from "@tsed/socketio";
 * import {ErrorHandlerSocketMiddleware} from "../middlewares";
 * import {User} from "../models/User";
 *
 * @SocketService("/my-namespace")
 * @SocketUseAfter(ErrorHandlerSocketMiddleware) // global version
 * export class MySocketService {
 *
 *    @Input("eventName")
 *    @Emit("responseEventName") // or Broadcast or BroadcastOthers
 *    @SocketUseAfter(ErrorHandlerSocketMiddleware)
 *    async myMethod(@Args(0) userName: User) {
 *
 *        console.log(user);
 *        throw new Error("Error");
 *
 *        return user;
 *    }
 * }
 * ```
 *
 * @returns {(target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void}
 * @decorator
 * @experimental
 * @param middlewares
 */
export function SocketUseAfter(...middlewares: Type<any>[]) {
    return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
        if (propertyKey) {
            Store.from(target).merge("socketIO", {
                handlers: {
                    [propertyKey]: {
                        useAfter: middlewares
                    }
                }
            });
        } else {
            Store.from(target).merge("socketIO", {
                useAfter: middlewares
            });
        }
    };
}
