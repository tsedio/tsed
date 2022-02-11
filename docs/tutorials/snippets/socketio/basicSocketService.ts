import {IO, Nsp, Socket, SocketService, SocketSession} from "@tsed/socketio";
import * as SocketIO from "socket.io";

@SocketService("/my-socket-namespace")
export class MySocketService {
  @Nsp nsp: SocketIO.Namespace;

  // a map to keep clients by any id you like, a userId or whatever.
  public clients: Map<string, SocketIO.Socket> = new Map();

  constructor(@IO private io: SocketIO.Server) {}

  /**
   * Triggered when a new client connects to the Namespace.
   */
  $onConnection(@Socket socket: SocketIO.Socket, @SocketSession session: SocketSession) {
    console.log("=====   CONNECTED A CLIENT   =====");
    console.log(`===== SOCKET ID ${socket.id} =====`);

    this.clients.set(socket.id, socket);

    // if you pass in a query of some kind you could use an id passed from the front end
    // instead of the socket id, like this.
    const yourId: string | undefined = socket.handshake.query.yourId?.toString();
    if (yourId) this.clients.set(yourId, socket);
  }

  // setup a method to send data to all clients
  // you can use this from any other service or controller.
  broadcast(someData: any): void {
    this.nsp.emit("event_name", someData);
  }

  // method to send to a targeted client
  sendToSingleClient(idToSendTo: string, someData: any): void {
    const socket = this.clients.get(idToSendTo);
    if (!socket) return;
    socket.emit("eventName", someData);
  }
}
