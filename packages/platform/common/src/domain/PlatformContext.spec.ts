import {PlatformApplication, PlatformTest} from "@tsed/common";
import {nameOf} from "@tsed/core";
import {PlatformHandlerMetadata} from "@tsed/platform-router";
import {PlatformContext} from "./PlatformContext";

describe("PlatformContext", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create a new Context and skip log", () => {
    const logger = {
      info: jest.fn()
    };
    const context = new PlatformContext({
      event: {
        response: PlatformTest.createResponse(),
        request: PlatformTest.createRequest({
          url: "/admin"
        })
      },
      id: "id",
      logger,
      maxStackSize: 0,
      ignoreUrlPatterns: ["/admin", /\/admin2/],
      injector: PlatformTest.injector
    });

    context.endpoint = {} as any;
    context.logger.info("test");

    context.handlerMetadata = {} as any;
    context.endpoint = {} as any;

    expect(context.id).toEqual("id");
    expect(context.dateStart).toBeInstanceOf(Date);
    expect(context.container).toBeInstanceOf(Map);
    expect(context.env).toEqual("test");
    expect(context.getRequest()).toEqual(context.request.raw);
    expect(context.getResponse()).toEqual(context.response.raw);
    expect(context.getReq()).toEqual(context.request.raw);
    expect(context.getRes()).toEqual(context.response.raw);
    expect(context.app).toBeInstanceOf(PlatformApplication);
    expect(context.handlerMetadata).toEqual({});
    expect(context.endpoint).toEqual({});
    expect(nameOf(context.getApp())).toEqual("FakeRawDriver");
  });
  it("should create a new Context and log event", () => {
    const logger = {
      info: jest.fn()
    };

    const context = new PlatformContext({
      id: "id",
      event: {
        response: PlatformTest.createResponse(),
        request: PlatformTest.createRequest({
          url: "/"
        })
      },
      logger,
      injector: PlatformTest.injector,
      maxStackSize: 0,
      ignoreUrlPatterns: ["/admin", /\/admin2/]
    });

    context.logger.info("test");

    expect(context.id).toEqual("id");
    expect(context.dateStart).toBeInstanceOf(Date);
    expect(context.container).toBeInstanceOf(Map);
    expect(context.env).toEqual("test");
    expect(context.app).toBeInstanceOf(PlatformApplication);
    expect(nameOf(context.getApp())).toEqual("FakeRawDriver");
  });
  it("should return done when the response is empty", async () => {
    const context = new PlatformContext({
      id: "id",
      event: {
        response: PlatformTest.createResponse(),
        request: PlatformTest.createRequest({
          url: "/"
        })
      },
      logger: {
        info: jest.fn()
      },
      injector: PlatformTest.injector,
      maxStackSize: 0,
      ignoreUrlPatterns: ["/admin"]
    });

    expect(context.isDone()).toEqual(false);

    await context.destroy();

    expect(context.isDone()).toEqual(true);
  });
  it("should return done when the response is empty", async () => {
    // @ts-ignore
    const context = new PlatformContext({
      id: "id",
      event: {
        response: PlatformTest.createResponse(),
        request: PlatformTest.createRequest({
          url: "/"
        })
      },
      logger: {
        info: jest.fn()
      },
      injector: PlatformTest.injector,
      maxStackSize: 0,
      ignoreUrlPatterns: ["/admin"]
    });

    expect(context.isDone()).toEqual(false);

    await context.destroy();

    expect(context.isDone()).toEqual(true);
  });
});
