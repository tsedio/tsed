import {PlatformTest} from "@tsed/common";
import {SocketIOService} from "../index.js";
import {Server} from "./SocketIOServer.js";

async function createServiceFixture() {
  const namespace = {
    on: vi.fn()
  };
  const ioStub = {
    of: vi.fn().mockReturnValue(namespace)
  };
  const instance = {
    onConnection: vi.fn(),
    onDisconnect: vi.fn()
  };

  const socket = {
    on: vi.fn()
  };

  const service = await PlatformTest.invoke(SocketIOService, [
    {
      token: Server,
      use: ioStub
    }
  ]);
  const reason = "transport error";

  return {namespace, ioStub, service, instance, socket, reason};
}

describe("SocketIOService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("getNsp", () => {
    it.each([{input: "/"}, {input: /test/}])("should call io.of with $input and create namespace", async ({input}) => {
      const {service, namespace, ioStub, socket, instance, reason} = await createServiceFixture();

      const nspConf = service.getNsp(input);
      nspConf.instances.push(instance);

      namespace.on.mock.calls[0][1](socket);
      socket.on.mock.calls[0][1](reason);

      expect(ioStub.of).toBeCalledWith(input);
      expect(namespace.on).toBeCalledWith("connection", expect.any(Function));
      expect(instance.onConnection).toBeCalledWith(socket, namespace);
      expect(socket.on).toBeCalledWith("disconnect", expect.any(Function));
      expect(instance.onDisconnect).toBeCalledWith(socket, namespace, reason);
    });
  });
});
