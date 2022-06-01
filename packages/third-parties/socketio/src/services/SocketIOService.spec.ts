import {PlatformTest} from "@tsed/common";
import {SocketIOService} from "../index";
import {Server} from "./SocketIOServer";

async function createServiceFixture() {
  const namespace = {
    on: jest.fn()
  };
  const ioStub = {
    of: jest.fn().mockReturnValue(namespace)
  };
  const instance = {
    onConnection: jest.fn(),
    onDisconnect: jest.fn()
  };

  const socket = {
    on: jest.fn()
  };

  const service = await PlatformTest.invoke(SocketIOService, [
    {
      token: Server,
      use: ioStub
    }
  ]);

  return {namespace, ioStub, service, instance, socket};
}

describe("SocketIOService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("getNsp()", () => {
    it("should call io.of and create namespace", async () => {
      const {service, namespace, ioStub, socket, instance} = await createServiceFixture();

      const nspConf = service.getNsp("/");
      nspConf.instances.push(instance);

      namespace.on.mock.calls[0][1](socket);
      socket.on.mock.calls[0][1]();

      expect(ioStub.of).toBeCalledWith("/");
      expect(namespace.on).toBeCalledWith("connection", expect.any(Function));
      expect(instance.onConnection).toBeCalledWith(socket, namespace);
      expect(socket.on).toBeCalledWith("disconnect", expect.any(Function));
      expect(instance.onDisconnect).toBeCalledWith(socket, namespace);
    });
  });
});
