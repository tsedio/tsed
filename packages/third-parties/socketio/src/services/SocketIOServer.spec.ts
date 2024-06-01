import {PlatformTest} from "@tsed/common";
import {SocketIOServer, Server} from "./SocketIOServer.js";

describe("SocketIOServer", () => {
  describe("when there is configuration", () => {
    beforeEach(() =>
      PlatformTest.create({
        socketIO: {
          path: "/api/ws"
        }
      })
    );
    afterEach(PlatformTest.reset);

    it("should inject the SocketIO server", () => {
      const server = PlatformTest.get<SocketIOServer>(SocketIOServer);

      expect(server).toBeInstanceOf(Server);
    });
  });

  describe("when there is no configuration", () => {
    beforeEach(() => PlatformTest.create({}));
    afterEach(PlatformTest.reset);

    it("should inject the SocketIO server", () => {
      const server = PlatformTest.get<SocketIOServer>(SocketIOServer);

      expect(server).toBeInstanceOf(Server);
    });
  });
});
