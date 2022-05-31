import {PlatformTest} from "@tsed/common";
import {DIContext} from "./DIContext";

describe("DIContext", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  describe("constructor", () => {
    it("should create a new Context and skip log", () => {
      const context = new DIContext({
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

      context.logger.info("test");

      expect((context.logger as any).logger.info).toHaveBeenCalled();

      context.destroy();
    });
    it("should create a new Context and log event", () => {
      // @ts-ignore
      const context = new DIContext({
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

      context.logger.info("test");

      expect((context.logger as any).logger.info).toHaveBeenCalled();
    });
  });

  describe("emit()", () => {
    it("should emit event", async () => {
      const context = new DIContext({
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
        injector: {emit: jest.fn()} as any,
        ignoreUrlPatterns: ["/admin", /\/admin2/]
      });

      await context.emit("event", "test");

      expect(context.injector.emit).toHaveBeenCalledWith("event", "test");
    });
  });
});
