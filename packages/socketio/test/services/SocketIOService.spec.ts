import {HttpServer, HttpsServer} from "@tsed/common";
import {InjectorService} from "@tsed/di";
import {inject, TestContext} from "@tsed/testing";
import * as Sinon from "sinon";
import {SocketIOService} from "../../src";

describe("SocketIOService", () => {
  describe("getNsp()", () => {
    before(
      inject([InjectorService], (injector: InjectorService) => {
        this.namespace = {
          on: Sinon.stub()
        };
        this.ioStub = {
          of: Sinon.stub().returns(this.namespace)
        };
        this.instance = {
          onConnection: Sinon.stub(),
          onDisconnect: Sinon.stub()
        };
        this.socket = {
          on: Sinon.stub()
        };

        const service = new SocketIOService(injector, this.ioStub, {} as any);
        const nspConf = service.getNsp("/");
        nspConf.instances.push(this.instance);

        this.namespace.on.getCall(0).args[1](this.socket);
        this.socket.on.getCall(0).args[1]();
      })
    );

    after(TestContext.reset);

    it("should call io.of and create namespace", () => {
      this.ioStub.of.should.have.been.calledWithExactly("/");
    });

    it("should call namespace.on", () => {
      this.namespace.on.should.have.been.calledWithExactly("connection", Sinon.match.func);
    });

    it("should call builder.onConnection", () => {
      this.instance.onConnection.should.have.been.calledWithExactly(this.socket, this.namespace);
    });

    it("should call socket.on when socket is disconnected", () => {
      this.socket.on.should.have.been.calledWithExactly("disconnect", Sinon.match.func);
    });

    it("should call builder.onDisconnect", () => {
      this.instance.onDisconnect.should.have.been.calledWithExactly(this.socket, this.namespace);
    });
  });
});
