import {PlatformConfiguration, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {SocketIOModule, SocketIOServer, SocketIOService} from "./index";
import Http from "http";
import Https from "https";

const sandbox = Sinon.createSandbox();
describe("SocketIOModule", () => {
  describe("$afterListen()", () => {
    describe("with http server", () => {
      before(() =>
        PlatformTest.create({
          httpPort: 8080,
          httpsPort: 8081
        })
      );
      before(() => {
        sandbox.stub(SocketIOModule.prototype as any, "getWebsocketServices");
        sandbox.stub(SocketIOModule.prototype as any, "printSocketEvents");
      });
      after(() => {
        PlatformTest.reset();
        sandbox.restore();
      });

      it("should call attach method", async () => {
        const serverSettingsService = PlatformTest.get<PlatformConfiguration>(PlatformConfiguration);
        // GIVEN
        const socketIOServer = {attach: Sinon.stub(), adapter: Sinon.stub()};
        const socketIOService = {addSocketProvider: Sinon.stub()};

        serverSettingsService.set("socketIO", {config: "config", adapter: "adapter"});

        const socketIOModule = await PlatformTest.invoke(SocketIOModule, [
          {token: SocketIOServer, use: socketIOServer},
          {token: SocketIOService, use: socketIOService}
        ]);

        (SocketIOModule.prototype as any).getWebsocketServices.returns([{provider: "provider"}]);

        // WHEN
        await socketIOModule.$afterListen();

        expect(socketIOServer.attach).to.have.been.calledWithExactly(Sinon.match.instanceOf(Http.Server), {
          adapter: "adapter",
          config: "config"
        });
        expect(socketIOServer.attach).to.have.been.calledWithExactly(Sinon.match.instanceOf(Https.Server), {
          adapter: "adapter",
          config: "config"
        });

        expect((SocketIOModule.prototype as any).getWebsocketServices).to.have.been.calledWithExactly();
        expect(socketIOServer.adapter).to.have.been.calledWithExactly("adapter");
        expect(socketIOService.addSocketProvider).to.have.been.calledWithExactly({provider: "provider"});
      });
    });
    describe("with https server", () => {
      before(() =>
        PlatformTest.create({
          httpsPort: 8081
        })
      );
      before(() => {
        sandbox.stub(SocketIOModule.prototype as any, "getWebsocketServices");
        sandbox.stub(SocketIOModule.prototype as any, "printSocketEvents");
      });
      after(() => {
        PlatformTest.reset();
        sandbox.restore();
      });

      it("should call attach method", async () => {
        const serverSettingsService = PlatformTest.get<PlatformConfiguration>(PlatformConfiguration);

        // GIVEN
        const socketIOServer = {attach: Sinon.stub(), adapter: Sinon.stub()};
        const socketIOService = {addSocketProvider: Sinon.stub()};

        serverSettingsService.set("socketIO", {config: "config"});
        serverSettingsService.set("http", false);

        const socketIOModule = await PlatformTest.invoke(SocketIOModule, [
          {token: SocketIOServer, use: socketIOServer},
          {token: SocketIOService, use: socketIOService}
        ]);

        (SocketIOModule.prototype as any).getWebsocketServices.returns([{provider: "provider"}]);
        // WHEN
        await socketIOModule.$afterListen();

        expect(socketIOServer.attach).to.have.been.calledWithExactly(Sinon.match.instanceOf(Https.Server), {
          config: "config"
        });

        expect((SocketIOModule.prototype as any).getWebsocketServices).to.have.been.calledWithExactly();
        expect(socketIOService.addSocketProvider).to.have.been.calledWithExactly({provider: "provider"});
      });
    });
  });
});
