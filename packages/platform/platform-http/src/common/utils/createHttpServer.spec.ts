import {configuration, destroyInjector, injector, InjectorService, logger} from "@tsed/di";
import Http from "http";

import {createHttpServer} from "./createHttpServer.js";

describe("createHttpServer", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  afterEach(() => destroyInjector());
  it("should create an instance of Http (http port true)", async () => {
    configuration().set("httpPort", true);

    const fn: any = vi.fn();

    const listener: any = createHttpServer(fn);

    expect(!!injector().get(Http.Server)).toEqual(true);

    expect(listener).toBeInstanceOf(Function);

    const server = injector().get(Http.Server)!;

    vi.spyOn(logger(), "info").mockReturnValue(undefined);
    vi.spyOn(logger(), "debug").mockReturnValue(undefined);
    vi.spyOn(server, "listen").mockReturnValue(undefined as never);
    vi.spyOn(server, "address").mockReturnValue({port: 8089, address: "0.0.0.0"} as never);
    vi.spyOn(server, "on").mockImplementation(((event: string, cb: any) => {
      if (event === "listening") {
        cb();
      }
    }) as never);

    await listener();

    expect(server.listen).toHaveBeenCalledWith(true, "0.0.0.0");
    expect(logger().info).toHaveBeenCalledWith("Listen server on http://0.0.0.0:8089");
  });

  it("should create a raw object (http port false)", () => {
    configuration().set("httpPort", false);

    const fn: any = vi.fn();

    const listener = createHttpServer(fn);

    expect(injector().get(Http.Server)).toEqual(null);

    expect(listener).toBeUndefined();
  });

  it("should create an instance of Http (http port 0)", () => {
    configuration().set("httpPort", 0);

    const fn: any = vi.fn();

    const listener = createHttpServer(fn);

    expect(!!injector().get(Http.Server)).toEqual(true);

    expect(listener).toBeInstanceOf(Function);
  });
  it("should create an instance of Http (http port + address)", () => {
    configuration().set("httpPort", "0.0.0.0:8080");

    const fn: any = vi.fn();

    const listener = createHttpServer(fn);

    expect(!!injector().get(Http.Server)).toEqual(true);

    expect(listener).toBeInstanceOf(Function);
  });
});
