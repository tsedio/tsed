import {Inject, PlatformTest} from "@tsed/common";
import {$log} from "@tsed/logger";
import {PlatformExpress} from "@tsed/platform-express";
import {Args, Emit, Input, SocketIOServer, SocketMiddleware, SocketService, SocketUseBefore} from "@tsed/socketio";
import {SocketClientService} from "@tsed/socketio-testing";
import {expect} from "chai";
import {Namespace, Socket as IOSocket} from "socket.io";
import {User} from "./app/models/User";
import {Server} from "./app/Server";

@SocketMiddleware()
export class SocketMiddlewareLogger {
  async use(@Args() args: any[]) {
    expect(args).to.deep.eq([
      "message"
    ])
    args[0] += " added"
    return args
  }
}

@SocketService("/test")
export class TestWS {
  @Input("input:scenario1")
  @SocketUseBefore(SocketMiddlewareLogger)
  async scenario1(@Args(0) message: string) {
    expect(message).to.eq('message added')
  }
}


describe.only("Integration: SocketMiddleware", () => {
  before(PlatformTest.bootstrap(Server, {
    platform: PlatformExpress,
    listen: true,
    httpPort: 8999,
    componentsScan: [],
    mount: {},
    imports: [TestWS]
  }));
  after(PlatformTest.reset);

  describe("scenario1: Should call middleware", () => {
    it("should return the data", async () => {
      const service = PlatformTest.get<SocketClientService>(SocketClientService);
      const client = await service.get("/test");

      client.emit("input:scenario1", "message");
    });
  });
});