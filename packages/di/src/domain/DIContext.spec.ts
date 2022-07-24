import {bindContext, getAsyncStore, PlatformTest} from "@tsed/common";
import {DIContext} from "./DIContext";

describe("DIContext", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  describe("constructor", () => {
    it("should create a new Context and skip log", () => {
      const logger = {
        info: jest.fn()
      };
      const context = new DIContext({
        event: {
          response: PlatformTest.createResponse(),
          request: PlatformTest.createRequest({
            url: "/admin"
          })
        },
        id: "id",
        logger,
        maxStackSize: 0,
        injector: PlatformTest.injector
      });

      expect(context.id).toEqual("id");
      expect(context.dateStart).toBeInstanceOf(Date);
      expect(context.container).toBeInstanceOf(Map);
      expect(context.env).toEqual("test");

      context.logger.info("test");

      expect(logger.info).toHaveBeenCalled();

      context.destroy();
    });
    it("should create a new Context and log event", () => {
      const logger = {
        info: jest.fn()
      };

      const context = new DIContext({
        id: "id",
        event: {
          response: PlatformTest.createResponse(),
          request: PlatformTest.createRequest({
            url: "/"
          })
        },
        logger,
        injector: PlatformTest.injector,
        maxStackSize: 0
      });

      expect(context.id).toEqual("id");
      expect(context.dateStart).toBeInstanceOf(Date);
      expect(context.container).toBeInstanceOf(Map);
      expect(context.env).toEqual("test");

      context.logger.info("test");

      expect(logger.info).toHaveBeenCalled();
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
  describe("runInContext()", () => {
    it("should run handler in a context", async () => {
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
        injector: {
          alterAsync: jest.fn().mockImplementation((event, fn, $ctx) => {
            return fn;
          })
        } as any,
        ignoreUrlPatterns: ["/admin", /\/admin2/]
      });

      const stub = jest.fn();

      await context.runInContext(stub);

      expect(stub).toHaveBeenCalledWith();
      expect(context.injector.alterAsync).toHaveBeenCalledWith("$alterRunInContext", stub, context);
    });
    it("should run handler in a context + bind", async () => {
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
        injector: {
          alterAsync: jest.fn().mockImplementation((event, fn, $ctx) => {
            return fn;
          })
        } as any,
        ignoreUrlPatterns: ["/admin", /\/admin2/]
      });

      const stub = jest.fn();

      await context.runInContext(() => {
        bindContext(stub)();
        expect(getAsyncStore().getStore()).toEqual(context);
      });

      expect(stub).toHaveBeenCalledWith();
      expect(context.injector.alterAsync).toHaveBeenCalledWith("$alterRunInContext", expect.any(Function), context);
    });
    it("should run handler in a context and fallback to next", async () => {
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
        injector: {
          alterAsync: jest.fn().mockImplementation((event, fn, $ctx) => {
            return null;
          })
        } as any,
        ignoreUrlPatterns: ["/admin", /\/admin2/]
      });

      const stub = jest.fn();

      await context.runInContext(stub);

      expect(stub).toHaveBeenCalledWith();
      expect(context.injector.alterAsync).toHaveBeenCalledWith("$alterRunInContext", stub, context);
    });
  });
});
