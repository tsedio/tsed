import {HttpServer, HttpsServer} from "@tsed/common";
import {InjectorService} from "@tsed/di";
import {inject, TestContext} from "@tsed/testing";
import * as Sinon from "sinon";
import {ServerSettingsService} from "../../common/src/config";
import {SocketIOModule, SocketIOServer, SocketIOService} from "../src";

describe("SocketIOModule", () => {
  describe("$onServerReady()", () => {
    describe("with http server", () => {
      before(TestContext.create);
      before(() => {
        this.getWebsocketServicesStub = Sinon.stub(SocketIOModule.prototype as any, "getWebsocketServices");
        this.printSocketEventsStub = Sinon.stub(SocketIOModule.prototype as any, "printSocketEvents");
      });
      after(() => {
        TestContext.reset();
        this.getWebsocketServicesStub.restore();
        this.printSocketEventsStub.restore();
      });

      it("should call attach method", inject([ServerSettingsService], async (serverSettingsService: ServerSettingsService) => {
        // GIVEN
        const socketIOServer = {attach: Sinon.stub(), adapter: Sinon.stub()};
        const httpServer = {type: "http", get: Sinon.stub().returns("httpServer")};
        const httpsServer = {type: "https", get: Sinon.stub().returns("httpsServer")};
        const socketIOService = {addSocketProvider: Sinon.stub()};

        serverSettingsService.set("socketIO", {config: "config", adapter: "adapter"});

        const socketIOModule = await TestContext.invoke(SocketIOModule, [
          {provide: HttpServer, use: httpServer},
          {provide: HttpsServer, use: httpsServer},
          {provide: SocketIOServer, use: socketIOServer},
          {provide: SocketIOService, use: socketIOService}
        ]);

        this.getWebsocketServicesStub.returns([{provider: "provider"}]);
        // WHEN
        await socketIOModule.$onServerReady();

        socketIOServer.attach.should.have.been.calledWithExactly(httpServer, {
          adapter: "adapter",
          config: "config"
        });
        socketIOServer.attach.should.have.been.calledWithExactly(httpsServer, {
          adapter: "adapter",
          config: "config"
        });

        this.getWebsocketServicesStub.should.have.been.calledWithExactly();
        socketIOServer.adapter.should.have.been.calledWithExactly("adapter");
        socketIOService.addSocketProvider.should.have.been.calledWithExactly({provider: "provider"});
      }));
    });
    describe("with https server", () => {
      before(TestContext.create);
      before(() => {
        this.getWebsocketServicesStub = Sinon.stub(SocketIOModule.prototype as any, "getWebsocketServices");
        this.printSocketEventsStub = Sinon.stub(SocketIOModule.prototype as any, "printSocketEvents");
      });
      after(() => {
        TestContext.reset();
        this.getWebsocketServicesStub.restore();
        this.printSocketEventsStub.restore();
      });

      it("should call attach method", inject([ServerSettingsService], async (serverSettingsService: ServerSettingsService) => {
        // GIVEN
        const socketIOServer = {attach: Sinon.stub(), adapter: Sinon.stub()};
        const httpServer = {type: "http", get: Sinon.stub().returns("httpServer")};
        const httpsServer = {type: "https", get: Sinon.stub().returns("httpsServer")};
        const socketIOService = {addSocketProvider: Sinon.stub()};

        serverSettingsService.set("socketIO", {config: "config"});
        serverSettingsService.set("http", false);

        const socketIOModule = await TestContext.invoke(SocketIOModule, [
          {provide: HttpServer, use: httpServer},
          {provide: HttpsServer, use: httpsServer},
          {provide: SocketIOServer, use: socketIOServer},
          {provide: SocketIOService, use: socketIOService}
        ]);

        this.getWebsocketServicesStub.returns([{provider: "provider"}]);
        // WHEN
        await socketIOModule.$onServerReady();

        socketIOServer.attach.should.have.been.calledWithExactly(httpsServer, {
          config: "config"
        });

        this.getWebsocketServicesStub.should.have.been.calledWithExactly();
        socketIOService.addSocketProvider.should.have.been.calledWithExactly({provider: "provider"});
      }));
    });
  });
});
