import {Namespace, SocketService} from "@tsed/socketio";

@SocketService()
export class MySocketService {
  @Namespace nsp: Namespace;

  helloAll() {
    this.nsp.emit("hi", "everyone!");
  }
}
