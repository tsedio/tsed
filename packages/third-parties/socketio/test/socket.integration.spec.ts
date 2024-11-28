import {Inject} from "@tsed/di";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {SocketClientService} from "@tsed/socketio-testing";
import {Namespace, Socket as IOSocket} from "socket.io";

import {Emit, Input, Nsp, SocketIOServer, SocketNsp, SocketService, SocketSession, SocketUseBefore} from "../src/index.js";
import {ConverterUserSocketMiddleware} from "./app/middlewares/ConverterUserSocketMiddleware.js";
import {Server} from "./app/Server.js";

@SocketService("/test")
export class TestWS {
  @Inject()
  private io: SocketIOServer;

  $onConnection(socket: IOSocket, nsp: Namespace) {}

  $onDisconnect(socket: IOSocket, nsp: Namespace) {}

  @Input("input:scenario1")
  @Emit("output:scenario1")
  @SocketUseBefore(ConverterUserSocketMiddleware)
  scenario1(@SocketSession session: SocketSession) {
    return Promise.resolve("my Message " + session.get("test"));
  }

  @Input("input:scenario1")
  scenario2() {
    return Promise.resolve("my Message");
  }
}

@SocketService(/test-.+/)
export class TestWS2 {
  @Inject()
  private io: SocketIOServer;

  @Nsp nsp: Namespace;

  $onConnection(socket: IOSocket, nsp: Namespace) {}

  $onDisconnect(socket: IOSocket, nsp: Namespace) {}

  @Input("input:scenario2")
  @Emit("output:scenario2")
  @SocketUseBefore(ConverterUserSocketMiddleware)
  scenario2(@SocketNsp nsp: SocketNsp) {
    return Promise.resolve("namespace:" + nsp.name);
  }
}

describe("Socket integration: default path", () => {
  beforeAll(
    PlatformTest.bootstrap(Server, {
      adapter: PlatformExpress,
      listen: true,
      httpPort: 8999,
      mount: {},
      disableComponentScan: true,
      imports: [TestWS]
    })
  );
  afterAll(PlatformTest.reset);

  describe("RoomWS: eventName", () => {
    it("should return the data", async () => {
      const service = PlatformTest.get<SocketClientService>(SocketClientService);
      const client = await service.get("/test");
      const client2 = await service.get("/test");

      expect(client).toEqual(client2);

      return new Promise((resolve: any) => {
        client.on("output:scenario1", (result) => {
          expect(result).toEqual("my Message test2");
          resolve();
        });

        client.emit("input:scenario1");
      });
    });
  });
});

describe("Socket integration: custom path", () => {
  const CUSTOM_WS_PATH = "/ws";

  beforeAll(
    PlatformTest.bootstrap(Server, {
      adapter: PlatformExpress,
      listen: true,
      httpPort: 8999,
      mount: {},
      imports: [TestWS],
      socketIO: {path: CUSTOM_WS_PATH}
    })
  );
  afterAll(PlatformTest.reset);

  describe("RoomWS: eventName (scenario 1)", () => {
    it("should return the data", async () => {
      const service = PlatformTest.get<SocketClientService>(SocketClientService);
      const client = await service.get("/test", CUSTOM_WS_PATH);

      return new Promise((resolve: any) => {
        client.on("output:scenario1", (result) => {
          expect(result).toEqual("my Message test2");
          resolve();
        });

        client.emit("input:scenario1");
      });
    });
  });

  describe("RoomWS: eventName (scenario 2)", () => {
    it("should return the data without Emit decorator (use callback parameters)", async () => {
      const service = PlatformTest.get<SocketClientService>(SocketClientService);
      const client = await service.get("/test", CUSTOM_WS_PATH);

      return new Promise((resolve: any) => {
        client.emit("input:scenario1", (result: any) => {
          expect(result).toEqual("my Message");
          resolve();
        });
      });
    });
  });
});

describe("Socket integration: Dynamic Namespace", () => {
  beforeAll(
    PlatformTest.bootstrap(Server, {
      adapter: PlatformExpress,
      listen: true,
      httpPort: 8999,
      componentsScan: [],
      mount: {},
      disableComponentScan: true,
      imports: [TestWS2]
    })
  );
  afterAll(PlatformTest.reset);

  describe("RoomWS: eventName (Dynamic Namespace)", () => {
    it("should return the data", async () => {
      const service = PlatformTest.get<SocketClientService>(SocketClientService);
      const client = await service.get("/test-1");
      const client2 = await service.get("/test-2");

      expect(client).not.toEqual(client2);

      return Promise.all([
        new Promise((resolve: any) => {
          client.on("output:scenario2", (result) => {
            expect(result).toEqual("namespace:/test-1");
            resolve();
          });

          client.emit("input:scenario2");
        }),

        new Promise((resolve: any) => {
          client2.on("output:scenario2", (result) => {
            expect(result).toEqual("namespace:/test-2");
            resolve();
          });

          client2.emit("input:scenario2");
        })
      ]);
    });
  });
});
