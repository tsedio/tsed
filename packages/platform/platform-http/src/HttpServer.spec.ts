import {InjectorService} from "@tsed/di";
import {Server, ServerModule} from "./HttpServer";
import {createServer} from "http";

jest.mock("http");

describe("HttpServer", () => {
  beforeEach(() => {
    (createServer as any).mockReturnValue({
      on: jest.fn(),
      listen: jest.fn(),
      close: jest.fn(),
      address: jest.fn().mockReturnValue({
        port: 8080
      })
    });
  });
  it("should create new HttpServer", async () => {
    const injector = new InjectorService();
    injector.add("PLATFORM_APPLICATION", {
      useFactory: () => ({
        callback: jest.fn()
      })
    });
    jest.spyOn(injector.logger, "info").mockReturnValue(undefined);
    injector.settings.getHttpPort = jest.fn().mockReturnValue({
      port: 8080
    });
    injector.settings.setHttpPort = jest.fn();

    const serverModule = injector.invoke<ServerModule>(ServerModule);
    const server = injector.get<Server>(Server)!;

    const promise = serverModule.$listen();

    (server.on as jest.Mock).mock.calls[0][1]();

    await promise;

    serverModule.$onDestroy();

    expect(server.on).toHaveBeenCalledWith("listening", expect.any(Function));
    expect(server.on).toHaveBeenCalledWith("error", expect.any(Function));
    expect(server.listen).toHaveBeenCalledWith(8080, undefined);
    expect(server.close).toHaveBeenCalledWith();
    expect(injector.settings.setHttpPort).toHaveBeenCalledWith({
      port: 8080
    });
  });
});
