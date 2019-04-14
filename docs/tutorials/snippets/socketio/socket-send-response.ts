import {Args, Emit, Input, Socket, SocketService} from "@tsed/socketio";

@SocketService("/my-namespace")
export class MySocketService {
  @Input("eventName")
  @Emit("responseEventName") // or Broadcast or BroadcastOthers
  async myMethod(@Args(0) userName: string, @Socket socket: Socket) {
    return "Message " + userName;
  }
}
