import {InjectorService} from "@tsed/di";
import {createHttpServer} from "./createHttpServer";

describe("createHttpServer", () => {
  afterEach(() => jest.resetAllMocks());
  it("should create an instance of Http (http port true)", async () => {
    const injector = new InjectorService();
    injector.settings.set("httpPort", true);

    const fn: any = jest.fn();

    const listener: any = createHttpServer(injector, fn);

    expect(!!injector.get(Http.Server)).toEqual(true);
    expect(!!injector.get(HttpServer)).toEqual(true);

    expect(listener).toBeInstanceOf(Function);

    const server = injector.get(Http.Server);

    expect(!!injector.get(Http.Server)).to.be.eq(true);

    await listener();

    expect(server.listen).toBeCalledWith(true, "0.0.0.0");
    expect(injector.logger.info).toBeCalledWith("Listen server on http://0.0.0.0:8089");
  });

  it("should create a raw object (http port false)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpPort", false);

    const fn: any = jest.fn();

    const listener = createHttpServer(injector, fn);

    expect(injector.get(Http.Server)).to.be.eq(null);

    expect(listener).toBeUndefined();
  });

  it("should create an instance of Http (http port 0)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpPort", 0);

    const fn: any = jest.fn();

    const listener = createHttpServer(injector, fn);

    expect(!!injector.get(Http.Server)).to.be.eq(true);

    expect(listener).toBeInstanceOf(Function);
  });
  it("should create an instance of Http (http port + address)", () => {
    const injector = new InjectorService();
    injector.settings.set("httpPort", "0.0.0.0:8080");

    const fn: any = jest.fn();

    const listener = createHttpServer(injector, fn);

    expect(!!injector.get(Http.Server)).to.be.eq(true);

    expect(listener).toBeInstanceOf(Function);
  });
});
