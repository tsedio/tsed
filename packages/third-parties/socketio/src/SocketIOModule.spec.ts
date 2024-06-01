import {PlatformConfiguration, PlatformTest} from "@tsed/common";
import Http from "http";
import Https from "https";
import {SocketIOModule, SocketIOServer, SocketIOService} from "./index.js";

async function createModuleFixture() {
  const serverSettingsService = PlatformTest.get<PlatformConfiguration>(PlatformConfiguration);
  // GIVEN
  const socketIOServer = {attach: jest.fn(), adapter: jest.fn()};
  const httpServer = {type: "http", get: jest.fn().mockReturnValue("httpServer")};
  const httpsServer = {type: "https", get: jest.fn().mockReturnValue("httpsServer")};
  const socketIOService = {addSocketProvider: jest.fn()};
  const socketIOModule = await PlatformTest.invoke<SocketIOModule>(SocketIOModule, [
    {token: Http.Server, use: httpServer},
    {token: Https.Server, use: httpsServer},
    {token: SocketIOServer, use: socketIOServer},
    {token: SocketIOService, use: socketIOService}
  ]);

  jest.spyOn(socketIOModule as any, "getWebsocketServices").mockReturnValue([{provider: "provider"}]);
  jest.spyOn(socketIOModule as any, "printSocketEvents").mockReturnValue(undefined);

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
          socketIO: {config: "config", adapter: jest.fn()} as unknown
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

        expect((socketIOModule as any).getWebsocketServices).toBeCalledWith();
        expect(socketIOServer.adapter).toBeCalled();
        expect(socketIOService.addSocketProvider).toBeCalledWith({provider: "provider"});
      });
    });
    describe("with https server", () => {
      beforeAll(() =>
        PlatformTest.create({
          httpsPort: 8081,
          http: false,
          socketIO: {config: "config"} as unknown
        })
      );

      afterAll(() => {
        PlatformTest.reset();
      });

      it("should call attach method", async () => {
        const {socketIOModule, httpsServer, serverSettingsService, socketIOService, socketIOServer} = await createModuleFixture();

        // WHEN
        await socketIOModule.$afterListen();

        expect(socketIOServer.attach).toBeCalled();

        expect((socketIOModule as any).getWebsocketServices).toBeCalledWith();
        expect(socketIOService.addSocketProvider).toBeCalledWith({provider: "provider"});
      });
    });
  });
});
