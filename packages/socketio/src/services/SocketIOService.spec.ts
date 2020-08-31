import {expect} from "chai";
import {InjectorService} from "@tsed/di";
import {PlatformTest} from "@tsed/common";
import * as Sinon from "sinon";
import {SocketIOService} from "../index";

describe("SocketIOService", () => {
  describe("getNsp()", () => {
    let namespace: any;
    let ioStub: any;
    let socket: any;
    let instance: any;

    before(
      PlatformTest.inject([InjectorService], (injector: InjectorService) => {
        namespace = {
          on: Sinon.stub()
        };
        ioStub = {
          of: Sinon.stub().returns(namespace)
        };
        instance = {
          onConnection: Sinon.stub(),
          onDisconnect: Sinon.stub()
        };
        socket = {
          on: Sinon.stub()
        };

        const service = new SocketIOService(injector, ioStub, {} as any);
        const nspConf = service.getNsp("/");
        nspConf.instances.push(instance);

        namespace.on.getCall(0).args[1](socket);
        socket.on.getCall(0).args[1]();
      })
    );

    after(PlatformTest.reset);

    it("should call io.of and create namespace", () => {
      expect(ioStub.of).to.have.been.calledWithExactly("/");
    });

    it("should call namespace.on", () => {
      expect(namespace.on).to.have.been.calledWithExactly("connection", Sinon.match.func);
    });

    it("should call builder.onConnection", () => {
      expect(instance.onConnection).to.have.been.calledWithExactly(socket, namespace);
    });

    it("should call socket.on when socket is disconnected", () => {
      expect(socket.on).to.have.been.calledWithExactly("disconnect", Sinon.match.func);
    });

    it("should call builder.onDisconnect", () => {
      expect(instance.onDisconnect).to.have.been.calledWithExactly(socket, namespace);
    });
  });
});
