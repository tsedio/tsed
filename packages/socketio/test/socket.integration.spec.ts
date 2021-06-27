import {Inject, PlatformTest} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {Args, Emit, Input, SocketIOServer, SocketMiddleware, SocketService, SocketUseBefore} from "@tsed/socketio";
import {SocketClientService} from "@tsed/socketio-testing";
import {expect} from "chai";
import {Namespace, Socket as IOSocket} from "socket.io";
import {User} from "./app/models/User";
import {Server} from "./app/Server";

@SocketMiddleware()
class CheckUserMiddleware {
  use(@Args(0) user: User) {
    expect(user).to.be.instanceOf(User);
    return [user];
  }
}

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
  @SocketUseBefore(CheckUserMiddleware)
  async scenario1(@Args(0) user: User) {
    return {
      message: "User connect: " + user.name,
      user
    };
  }
}


describe("Socket integration", () => {
  before(PlatformTest.bootstrap(Server, {
    platform: PlatformExpress,
    listen: true,
    httpPort: 8999,
    componentsScan: [],
    mount: {},
    imports: [TestWS]
  }));
  after(PlatformTest.reset);

  describe("scenario1: Should handle event", () => {
    it("should return the data", async () => {
      const service = PlatformTest.get<SocketClientService>(SocketClientService);
      const client = await service.get("/test");
      const client2 = await service.get("/test");

      expect(client).to.eq(client2);

      return new Promise((resolve) => {
        client.on("output:scenario1", (result) => {
          expect(result).to.deep.eq({
            "message": "User connect: name",
            "user": {
              "email": "email@domain.fr",
              "name": "name"
            }
          });
          resolve();
        });

        client.emit("input:scenario1", {
          id: "id",
          name: "name",
          email: "email@domain.fr"
        });
      });
    });
  });
});