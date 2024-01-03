import {InjectorService} from "@tsed/di";
import Http from "http";
import {createHttpServer} from "./createHttpServer";

describe("createHttpServer", () => {
  afterEach(() => jest.resetAllMocks());
  it("should create an instance of Http (http port true)", async () => {
    const injector = new InjectorService();
    injector.settings.set("httpPort", true);

    const fn: any = jest.fn();

    const listener: any = createHttpServer(injector, fn);

    expect(!!injector.get(Http.Server)).toEqual(true);

    expect(listener).toBeInstanceOf(Function);

    const server = injector.get(Http.Server);

    jest.spyOn(injector.logger, "info").mockReturnValue(undefined);
    jest.spyOn(injector.logger, "debug").mockReturnValue(undefined);
    jest.spyOn(server, "listen").mockReturnValue(undefined);
    jest.spyOn(server, "address").mockReturnValue({port: 8089, address: "0.0.0.0"});
    jest.spyOn(server, "on").mockImplementation((event: string, cb: any) => {
      if (event === "listening") {
        cb();
      }
    });

    await listener();

    expect(server.listen).toBeCalledWith(true, "0.0.0.0");
    expect(injector.logger.info).toBeCalledWith("Listen server on http://0.0.0.0:8089");
  });

  it("should create a raw object (http port false)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpPort", false);

    const fn: any = jest.fn();

    const listener = createHttpServer(injector, fn);

    expect(injector.get(Http.Server)).toEqual(null);

    expect(listener).toBeUndefined();
  });

  it("should create an instance of Http (http port 0)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpPort", 0);

    const fn: any = jest.fn();

    const listener = createHttpServer(injector, fn);

    expect(!!injector.get(Http.Server)).toEqual(true);

    expect(listener).toBeInstanceOf(Function);
  });
  it("should create an instance of Http (http port + address)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpPort", "0.0.0.0:8080");

    const fn: any = jest.fn();

    const listener = createHttpServer(injector, fn);

    expect(!!injector.get(Http.Server)).toEqual(true);

    expect(listener).toBeInstanceOf(Function);
  });
});
