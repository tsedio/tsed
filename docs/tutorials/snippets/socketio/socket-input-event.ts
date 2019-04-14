import {Args, Input, Namespace, Socket, SocketService} from "@tsed/socketio";

@SocketService("/my-namespace")
export class MySocketService {
  @Input("eventName")
  myMethod(@Args(0) userName: string, @Socket socket: Socket, @Namespace nsp: Namespace) {
    console.log(userName);
  }
}
