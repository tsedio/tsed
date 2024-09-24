import {Input, Nsp, SocketNsp, SocketService} from "@tsed/socketio";
import * as SocketIO from "socket.io";

@SocketService(/my-namespace-.+/)
export class MySocketService {
  // This will be the parent namespace.
  @Nsp nsp: SocketIO.Namespace;

  @Input("eventName")
  async myMethod(@SocketNsp nsp: SocketNsp) {
    // nsp is the actual namespace of this call.
  }
}
