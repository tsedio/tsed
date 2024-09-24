import {Store, Type} from "@tsed/core";
import {Middleware} from "@tsed/platform-middlewares";

import {SocketProviderTypes} from "../interfaces/SocketProviderTypes.js";

/**
 * Declare a new SocketMiddleware.
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
 *         user = this.converterService.deserialize(user, User);
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
 * import {UserConverterSocketMiddleware} from "../middlewares.js";
 * import {User} from "../models/User.js";
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
 * @returns {Function}
 * @decorator
 * @experimental
 */
export function SocketMiddleware(): Function {
  return (target: Type<any>) => {
    Store.from(target).merge("socketIO", {
      type: SocketProviderTypes.MIDDLEWARE,
      handlers: {
        use: {
          methodClassName: "use"
        }
      }
    });

    return Middleware()(target);
  };
}
