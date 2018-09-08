import {InjectorService} from "@tsed/common";
import {inject, invoke} from "@tsed/testing";
import {HttpServer} from "../../../../packages/common/src/server/decorators/httpServer";
import {HttpsServer} from "../../../../packages/common/src/server/decorators/httpsServer";
import {SocketIOServer, SocketIOService} from "../../../../packages/socketio/src";
import {Sinon} from "../../../tools";

describe("SocketIOService", () => {
  describe("$onServerReady()", () => {
    describe("with http server", () => {
      let socketIOService: any;

      before(() => {
        this.socketIOServer = {attach: Sinon.stub(), adapter: Sinon.stub()};
        this.httpServer = {type: "http", get: Sinon.stub().returns("httpServer")};
        this.httpsServer = {type: "https", get: Sinon.stub().returns("httpsServer")};

        socketIOService = invoke(SocketIOService, [
          {provide: HttpServer, use: this.httpServer},
          {provide: HttpsServer, use: this.httpsServer},
          {provide: SocketIOServer, use: this.socketIOServer}
        ]);

        this.getWebsocketServicesStub = Sinon.stub(socketIOService, "getWebsocketServices");
        this.bindProviderStub = Sinon.stub(socketIOService, "bindProvider");
        this.printSocketEventsStub = Sinon.stub(socketIOService, "printSocketEvents");

        this.getWebsocketServicesStub.returns([{provider: "provider"}]);

        socketIOService.serverSettingsService.set("socketIO", {config: "config", adapter: "adapter"});
        socketIOService.$onServerReady();
      });

      after(() => {
        this.getWebsocketServicesStub.restore();
        this.bindProviderStub.restore();
        this.printSocketEventsStub.restore();
      });

      it("should call attach method", () => {
        this.socketIOServer.attach.should.have.been.calledWithExactly(this.httpServer, {
          adapter: "adapter",
          config: "config"
        });
        this.socketIOServer.attach.should.have.been.calledWithExactly(this.httpsServer, {
          adapter: "adapter",
          config: "config"
        });
      });

      it("should call getWebsocketServices method", () => {
        this.getWebsocketServicesStub.should.have.been.calledWithExactly();
      });

      it("should call bind provider method", () => {
        this.bindProviderStub.should.have.been.calledWithExactly({provider: "provider"});
      });

      it("should call io.adaptater", () => {
        this.socketIOServer.adapter.should.have.been.calledWithExactly("adapter");
      });
    });
    describe("with https server", () => {
      let socketIOService: any;

      before(() => {
        this.socketIOServer = {attach: Sinon.stub()};
        this.httpServer = {type: "http", get: Sinon.stub().returns("httpServer")};
        this.httpsServer = {type: "https", get: Sinon.stub().returns("httpsServer")};

        socketIOService = invoke(SocketIOService, [
          {provide: HttpServer, use: this.httpServer},
          {provide: HttpsServer, use: this.httpsServer},
          {provide: SocketIOServer, use: this.socketIOServer}
        ]);

        socketIOService.serverSettingsService.httpPort = false;

        this.getWebsocketServicesStub = Sinon.stub(socketIOService, "getWebsocketServices");
        this.bindProviderStub = Sinon.stub(socketIOService, "bindProvider");
        this.printSocketEventsStub = Sinon.stub(socketIOService, "printSocketEvents");

        this.getWebsocketServicesStub.returns([{provider: "provider"}]);

        socketIOService.serverSettingsService.set("socketIO", {config: "config"});
        socketIOService.$onServerReady();
      });

      after(() => {
        this.getWebsocketServicesStub.restore();
        this.bindProviderStub.restore();
        this.printSocketEventsStub.restore();
      });

      it("should call attach method", () => {
        this.socketIOServer.attach.should.have.been.calledWithExactly(this.httpsServer, {config: "config"});
      });

      it("should call getWebsocketServices method", () => {
        this.getWebsocketServicesStub.should.have.been.calledWithExactly();
      });

      it("should call bind provider method", () => {
        this.bindProviderStub.should.have.been.calledWithExactly({provider: "provider"});
      });
    });
  });

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

        const service = new SocketIOService(injector, {} as any, {} as any, this.ioStub, {} as any, {} as any);
        const nspConf = service.getNsp("/");
        nspConf.instances.push(this.instance);

        this.namespace.on.getCall(0).args[1](this.socket);
        this.socket.on.getCall(0).args[1]();
      })
    );

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
