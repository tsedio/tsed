import {Store, Type} from "@tsed/core";
import {Middleware} from "@tsed/platform-middlewares";

import {SocketProviderTypes} from "../interfaces/SocketProviderTypes.js";

/**
 * Declare a new SocketMiddlewareError.
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
 *    async use(@SocketEventName, @SocketErr err: any, @Socket socket: SocketIO.Socket) {
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
 * import {ErrorHandlerSocketMiddleware} from "../middlewares.js";
 * import {User} from "../models/User.js";
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
 * @returns {Function}
 * @decorator
 * @experimental
 */
export function SocketMiddlewareError(): Function {
  return (target: Type<any>) => {
    Store.from(target).merge("socketIO", {
      type: SocketProviderTypes.MIDDLEWARE,
      error: true,

      handlers: {
        use: {
          methodClassName: "use"
        }
      }
    });

    return Middleware()(target);
  };
}
