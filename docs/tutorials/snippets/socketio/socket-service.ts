import {IO, Nsp, Reason, Socket, SocketService, SocketSession} from "@tsed/socketio";
import * as SocketIO from "socket.io";

@SocketService("/my-namespace")
export class MySocketService {
  @Nsp nsp: SocketIO.Namespace;

  @Nsp("/my-other-namespace")
  nspOther: SocketIO.Namespace; // communication between two namespace

  constructor(@IO private io: SocketIO.Server) {}

  /**
   * Triggered the namespace is created
   */
  $onNamespaceInit(nsp: SocketIO.Namespace) {}

  /**
   * Triggered when a new client connects to the Namespace.
   */
  $onConnection(@Socket socket: SocketIO.Socket, @SocketSession session: SocketSession) {}

  /**
   * Triggered when a client disconnects from the Namespace.
   */
  $onDisconnect(@Socket socket: SocketIO.Socket, @Reason reason: string) {}
}
