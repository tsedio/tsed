import {InjectorService} from "@tsed/di";
import Https from "https";

import {createHttpsServer} from "./createHttpsServer.js";

describe("createHttpsServer", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it("should create an instance of Https (Https port true)", async () => {
    const injector = new InjectorService();
    injector.settings.set("httpsPort", true);

    const fn: any = vi.fn();

    const listener = createHttpsServer(injector, fn)!;

    expect(!!injector.get(Https.Server)).toEqual(true);
    expect(listener).toBeInstanceOf(Function);

    const server = injector.get(Https.Server)!;

    vi.spyOn(injector.logger, "info").mockReturnValue(undefined);
    vi.spyOn(injector.logger, "debug").mockReturnValue(undefined);
    vi.spyOn(server, "listen").mockReturnValue(undefined as never);
    vi.spyOn(server, "address").mockReturnValue({port: 8089, address: "0.0.0.0"} as never);
    vi.spyOn(server, "on").mockImplementation(((event: string, cb: any) => {
      if (event === "listening") {
        cb();
      }
    }) as never);

    await listener();

    expect(server.listen).toHaveBeenCalledWith(true, "0.0.0.0");
    expect(injector.logger.info).toHaveBeenCalledWith("Listen server on https://0.0.0.0:8089");
  });

  it("should create a raw object (Https port false)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpsPort", false);

    const fn: any = vi.fn();

    const listener = createHttpsServer(injector, fn);

    expect(injector.get(Https.Server)).toEqual(null);

    expect(listener).toBeUndefined();
  });

  it("should create an instance of Https (https port 0)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpsPort", 0);

    const fn: any = vi.fn();

    const listener = createHttpsServer(injector, fn);

    expect(!!injector.get(Https.Server)).toEqual(true);

    expect(listener).toBeInstanceOf(Function);
  });
  it("should create an instance of Https (https port + address)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpsPort", "0.0.0.0:8080");

    const fn: any = vi.fn();

    const listener = createHttpsServer(injector, fn);

    expect(!!injector.get(Https.Server)).toEqual(true);

    expect(listener).toBeInstanceOf(Function);
  });
});
