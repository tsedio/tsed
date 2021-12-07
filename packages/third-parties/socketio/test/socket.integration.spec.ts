import {Inject, PlatformTest} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {Emit, Input, SocketIOServer, SocketService, SocketSession, SocketUseBefore} from "@tsed/socketio";
import {SocketClientService} from "@tsed/socketio-testing";
import {expect} from "chai";
import {Namespace, Socket as IOSocket} from "socket.io";
import {ConverterUserSocketMiddleware} from "./app/middlewares/ConverterUserSocketMiddleware";
import {Server} from "./app/Server";

@SocketService("/test")
export class TestWS {
  @Inject()
  private io: SocketIOServer;

  $onConnection(socket: IOSocket, nsp: Namespace) {
  }

  $onDisconnect(socket: IOSocket, nsp: Namespace) {
  }

  @Input("input:scenario1")
  @Emit("output:scenario1")
  @SocketUseBefore(ConverterUserSocketMiddleware)
  async scenario1(@SocketSession session: Map<any, any>) {
    return "my Message " + session.get("test");
  }
}


describe("Socket integration: default path", () => {
  before(PlatformTest.bootstrap(Server, {
    platform: PlatformExpress,
    listen: true,
    httpPort: 8999,
    componentsScan: [],
    mount: {},
    disableComponentScan: true,
    imports: [TestWS]
  }));
  after(PlatformTest.reset);

  describe("RoomWS: eventName", () => {
    it("should return the data", async () => {
      const service = PlatformTest.get<SocketClientService>(SocketClientService);
      const client = await service.get("/test");
      const client2 = await service.get("/test");

      expect(client).to.eq(client2)

      return new Promise((resolve: any) => {
        client.on("output:scenario1", (result) => {
          expect(result).to.eq("my Message test2");
          resolve();
        });

        client.emit("input:scenario1");
      });
    });
  });
});

describe("Socket integration: custom path", () => {

  const CUSTOM_WS_PATH = "/ws";

  before(PlatformTest.bootstrap(Server, {
    platform: PlatformExpress,
    listen: true,
    httpPort: 8999,
    componentsScan: [],
    mount: {},
    disableComponentScan: true,
    imports: [TestWS],
    socketIO: { path: CUSTOM_WS_PATH }
  }));
  after(PlatformTest.reset);

  describe("RoomWS: eventName", () => {
    it("should return the data", async () => {
      const service = PlatformTest.get<SocketClientService>(SocketClientService);
      const client = await service.get("/test", CUSTOM_WS_PATH);

      return new Promise((resolve: any) => {
        client.on("output:scenario1", (result) => {
          expect(result).to.eq("my Message test2");
          resolve();
        });

        client.emit("input:scenario1");
      });
    });
  });
});
