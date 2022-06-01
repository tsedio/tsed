import {InjectorService} from "@tsed/di";
import {HttpsServer} from "../decorators/httpsServer";
import {createHttpsServer} from "./createHttpsServer";
import Https from "https";

describe("createHttpsServer", () => {
  afterEach(() => jest.resetAllMocks());
  it("should create an instance of Https (Https port true)", async () => {
    const injector = new InjectorService();
    injector.settings.set("httpsPort", true);

    const fn: any = jest.fn();

    const listener = createHttpsServer(injector, fn)!;

    expect(!!injector.get(Https.Server)).toEqual(true);
    expect(!!injector.get(HttpsServer)).toEqual(true);
    expect(listener).toBeInstanceOf(Function);

    const server = injector.get(Https.Server);

    jest.spyOn(injector.logger, "info").mockReturnValue(undefined);
    jest.spyOn(injector.logger, "debug").mockReturnValue(undefined);
    jest.spyOn(server, "listen").mockReturnValue(undefined);
    jest.spyOn(server, "address").mockReturnValue({port: 8089});
    jest.spyOn(server, "on").mockImplementation((event: string, cb: any) => {
      if (event === "listening") {
        cb();
      }
    });

    await listener();

    expect(server.listen).toBeCalledWith(true, "0.0.0.0");
    expect(injector.logger.info).toBeCalledWith("Listen server on https://0.0.0.0:8089");
  });

  it("should create a raw object (Https port false)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpsPort", false);

    const fn: any = jest.fn();

    const listener = createHttpsServer(injector, fn);

    expect(injector.get(Https.Server)).toEqual(null);
    expect(injector.get(HttpsServer)).toEqual(null);

    expect(listener).toBeUndefined();
  });

  it("should create an instance of Https (https port 0)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpsPort", 0);

    const fn: any = jest.fn();

    const listener = createHttpsServer(injector, fn);

    expect(!!injector.get(Https.Server)).toEqual(true);
    expect(!!injector.get(HttpsServer)).toEqual(true);

    expect(listener).toBeInstanceOf(Function);
  });
  it("should create an instance of Https (https port + address)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpsPort", "0.0.0.0:8080");

    const fn: any = jest.fn();

    const listener = createHttpsServer(injector, fn);

    expect(!!injector.get(Https.Server)).toEqual(true);
    expect(!!injector.get(HttpsServer)).toEqual(true);

    expect(listener).toBeInstanceOf(Function);
  });
});
