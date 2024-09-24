import {Args, Emit, Input, SocketService, SocketUseAfter, SocketUseBefore} from "@tsed/socketio";

import {ErrorHandlerSocketMiddleware, UserConverterSocketMiddleware} from "../middlewares";
import {User} from "../models/User";

@SocketService("/my-namespace")
@SocketUseBefore(UserConverterSocketMiddleware) // global version
@SocketUseAfter(ErrorHandlerSocketMiddleware)
export class MySocketService {
  @Input("eventName")
  @Emit("responseEventName") // or Broadcast or BroadcastOthers
  @SocketUseBefore(UserConverterSocketMiddleware)
  @SocketUseAfter(ErrorHandlerSocketMiddleware)
  async myMethod(@Args(0) user: User) {
    console.log(user);

    return user;
  }
}
