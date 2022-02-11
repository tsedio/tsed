import {Args, Emit, Input, SocketService, SocketSession} from "@tsed/socketio";

@SocketService("/my-namespace")
export class MySocketService {
  @Input("eventName")
  @Emit("responseEventName") // or Broadcast or BroadcastOthers
  async myMethod(@Args(0) userName: string, @SocketSession session: SocketSession) {
    const user = session.get("user") || {};
    user.name = userName;

    session.set("user", user);

    return user;
  }
}
