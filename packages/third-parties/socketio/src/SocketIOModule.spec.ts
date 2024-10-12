import {PlatformConfiguration} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import Http from "http";
import Https from "https";

import {SocketIOModule, SocketIOServer, SocketIOService} from "./index.js";

async function createModuleFixture() {
  const serverSettingsService = PlatformTest.get<PlatformConfiguration>(PlatformConfiguration);
  // GIVEN
  const socketIOServer = {attach: vi.fn(), adapter: vi.fn()};
  const httpServer = {type: "http", get: vi.fn().mockReturnValue("httpServer")};
  const httpsServer = {type: "https", get: vi.fn().mockReturnValue("httpsServer")};
  const socketIOService = {addSocketProvider: vi.fn()};
  const socketIOModule = await PlatformTest.invoke<SocketIOModule>(SocketIOModule, [
    {token: Http.Server, use: httpServer},
    {token: Https.Server, use: httpsServer},
    {token: SocketIOServer, use: socketIOServer},
    {token: SocketIOService, use: socketIOService}
  ]);

  vi.spyOn(socketIOModule as any, "getWebsocketServices").mockReturnValue([{provider: "provider"}]);
  vi.spyOn(socketIOModule as any, "printSocketEvents").mockReturnValue(undefined);

  return {
    socketIOModule,
    serverSettingsService,
    httpServer,
    httpsServer,
    socketIOService,
    socketIOServer
  };
}

describe("SocketIOModule", () => {
  describe("$afterListen()", () => {
    describe("with http server", () => {
      beforeAll(() =>
        PlatformTest.create({
          httpsPort: 8081,
          socketIO: {config: "config", adapter: vi.fn()} as never
        })
      );
      afterAll(() => {
        PlatformTest.reset();
      });

      it("should call attach method", async () => {
        const {socketIOModule, httpServer, httpsServer, socketIOService, socketIOServer} = await createModuleFixture();

        // WHEN
        await socketIOModule.$afterListen();

        expect(socketIOServer.attach).toHaveBeenCalledTimes(2);

        expect((socketIOModule as any).getWebsocketServices).toHaveBeenCalledWith();
        expect(socketIOServer.adapter).toHaveBeenCalled();
        expect(socketIOService.addSocketProvider).toHaveBeenCalledWith({provider: "provider"});
      });
    });
    describe("with https server", () => {
      beforeAll(() =>
        PlatformTest.create({
          httpsPort: 8081,
          http: false,
          socketIO: {config: "config"} as never
        })
      );

      afterAll(() => {
        PlatformTest.reset();
      });

      it("should call attach method", async () => {
        const {socketIOModule, httpsServer, serverSettingsService, socketIOService, socketIOServer} = await createModuleFixture();

        // WHEN
        await socketIOModule.$afterListen();

        expect(socketIOServer.attach).toHaveBeenCalled();

        expect((socketIOModule as any).getWebsocketServices).toHaveBeenCalledWith();
        expect(socketIOService.addSocketProvider).toHaveBeenCalledWith({provider: "provider"});
      });
    });
  });
});
