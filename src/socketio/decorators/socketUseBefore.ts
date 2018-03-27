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
 * @SocketMiddleware()
 * export class UserConverterSocketMiddleware {
 *     constructor(private converterService: ConverterService) {
 *     }
 *     async use(@Args() args: any[]) {
 *
 *         let [user] = args;
 *         // update Arguments
 *         user = ConverterService.deserialize(user, User);
 *
 *         return [user];
 *     }
 * }
 * ```
 * > The user instance will be forwarded to the next middleware and to your decorated method.
 *
 * Then:
 *
 * ```typescript
 * import {SocketService, SocketUseAfter, SocketUseBefore, Emit, Input, Args} from "@tsed/socketio";
 * import {UserConverterSocketMiddleware} from "../middlewares";
 * import {User} from "../models/User";
 *
 * @SocketService("/my-namespace")
 * @SocketUseBefore(UserConverterSocketMiddleware) // global version
 * export class MySocketService {
 *
 *    @Input("eventName")
 *    @Emit("responseEventName") // or Broadcast or BroadcastOthers
 *    @SocketUseBefore(UserConverterSocketMiddleware)
 *    async myMethod(@Args(0) user: User) {
 *
 *        console.log(user);
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
export function SocketUseBefore(...middlewares: Type<any>[]) {
    return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
        if (propertyKey) {
            Store.from(target).merge("socketIO", {
                handlers: {
                    [propertyKey]: {
                        useBefore: middlewares
                    }
                }
            });
        } else {
            Store.from(target).merge("socketIO", {
                useBefore: middlewares
            });
        }

    };
}
