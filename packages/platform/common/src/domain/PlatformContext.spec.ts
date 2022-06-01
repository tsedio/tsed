import {PlatformApplication, PlatformTest} from "@tsed/common";
import {nameOf} from "@tsed/core";
import {PlatformContext} from "./PlatformContext";

describe("PlatformContext", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should create a new Context and skip log", () => {
    // @ts-ignore
    const context = new PlatformContext({
      event: {
        response: PlatformTest.createResponse(),
        request: PlatformTest.createRequest({
          url: "/admin"
        })
      },
      id: "id",
      logger: {
        info: jest.fn()
      },
      maxStackSize: 0,
      injector: PlatformTest.injector,
      ignoreUrlPatterns: ["/admin", /\/admin2/]
    });

    expect(context.id).toEqual("id");
    expect(context.dateStart).toBeInstanceOf(Date);
    expect(context.container).toBeInstanceOf(Map);
    expect(context.env).toEqual("test");
    expect(context.getRequest()).toEqual(context.request.raw);
    expect(context.getResponse()).toEqual(context.response.raw);
    expect(context.getReq()).toEqual(context.request.raw);
    expect(context.getRes()).toEqual(context.response.raw);
    expect(context.app).toBeInstanceOf(PlatformApplication);
    expect(nameOf(context.getApp())).toEqual("FakeRawDriver");

    context.logger.info("test");

    // @ts-ignore
    expect(context.logger.logger.info).not.toBeCalled();
  });
  it("should create a new Context and log event", () => {
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

    expect(context.id).toEqual("id");
    expect(context.dateStart).toBeInstanceOf(Date);
    expect(context.container).toBeInstanceOf(Map);
    expect(context.env).toEqual("test");
    expect(context.app).toBeInstanceOf(PlatformApplication);
    expect(nameOf(context.getApp())).toEqual("FakeRawDriver");

    context.logger.info("test");

    // @ts-ignore
    expect(context.logger.logger.info).toBeCalled();
  });
});
