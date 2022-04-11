import {expect} from "chai";
import {PlatformTest} from "@tsed/common";
import Sinon from "sinon";
import {SocketIOService} from "../index";
import {Server} from "./SocketIOServer";

async function createServiceFixture() {
  const namespace = {
    on: Sinon.stub()
  };
  const ioStub = {
    of: Sinon.stub().returns(namespace)
  };
  const instance = {
    onConnection: Sinon.stub(),
    onDisconnect: Sinon.stub()
  };

  const socket = {
    on: Sinon.stub()
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

      namespace.on.getCall(0).args[1](socket);
      socket.on.getCall(0).args[1]();

      expect(ioStub.of).to.have.been.calledWithExactly("/");
      expect(namespace.on).to.have.been.calledWithExactly("connection", Sinon.match.func);
      expect(instance.onConnection).to.have.been.calledWithExactly(socket, namespace);
      expect(socket.on).to.have.been.calledWithExactly("disconnect", Sinon.match.func);
      expect(instance.onDisconnect).to.have.been.calledWithExactly(socket, namespace);
    });
  });
});
