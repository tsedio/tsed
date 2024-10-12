import {PlatformTest} from "@tsed/platform-http/testing";

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

      expect(ioStub.of).toHaveBeenCalledWith(input);
      expect(namespace.on).toHaveBeenCalledWith("connection", expect.any(Function));
      expect(instance.onConnection).toHaveBeenCalledWith(socket, namespace);
      expect(socket.on).toHaveBeenCalledWith("disconnect", expect.any(Function));
      expect(instance.onDisconnect).toHaveBeenCalledWith(socket, namespace, reason);
    });
  });
});
