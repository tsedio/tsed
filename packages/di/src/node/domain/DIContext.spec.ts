import {DITest} from "../services/DITest.js";
import {bindContext, getAsyncStore} from "../utils/asyncHookContext.js";
import {DIContext} from "./DIContext.js";

describe("DIContext", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());
  describe("constructor", () => {
    it("should create a new Context and skip log", () => {
      const logger = {
        info: jest.fn()
      };
      const context = new DIContext({
        event: {
          response: {},
          request: {
            url: "/admin"
          }
        },
        id: "id",
        logger,
        maxStackSize: 0,
        injector: DITest.injector
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
          response: {},
          request: {url: "/"}
        },
        logger,
        injector: DITest.injector,
        maxStackSize: 0
      });

      context.next = jest.fn();

      expect(context.id).toEqual("id");
      expect(context.dateStart).toBeInstanceOf(Date);
      expect(context.container).toBeInstanceOf(Map);
      expect(context.env).toEqual("test");

      context.next();
      context.logger.info("test");

      expect(logger.info).toHaveBeenCalled();
    });
  });

  describe("cache()", () => {
    it("should cache data", () => {
      const context = new DIContext({
        event: {
          response: {},
          request: {url: "/admin"}
        },
        id: "id",
        logger: {
          info: jest.fn()
        },
        maxStackSize: 0,
        injector: {emit: jest.fn()} as any,
        ignoreUrlPatterns: ["/admin", /\/admin2/]
      });
      const resolver = jest.fn().mockReturnValue("test");

      const result = context.cache("key", resolver);
      const result2 = context.cache("key", resolver);

      expect(result).toEqual(result2);
      expect(resolver).toHaveBeenCalledTimes(1);
      expect(context.delete("key")).toEqual(true);
    });
  });
  describe("cacheAsync()", () => {
    it("should cache data", async () => {
      const context = new DIContext({
        event: {
          response: {},
          request: {url: "/admin"}
        },
        id: "id",
        logger: {
          info: jest.fn()
        },
        maxStackSize: 0,
        injector: {emit: jest.fn()} as any,
        ignoreUrlPatterns: ["/admin", /\/admin2/]
      });
      const resolver = jest.fn().mockResolvedValue("test");

      const result = await context.cacheAsync("key", resolver);
      const result2 = await context.cacheAsync("key", resolver);

      expect(result).toEqual(result2);
      expect(resolver).toHaveBeenCalledTimes(1);
    });
  });
  describe("emit()", () => {
    it("should emit event", async () => {
      const context = new DIContext({
        event: {
          response: {},
          request: {url: "/admin"}
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
          response: {},
          request: {url: "/admin"}
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
      expect(context.injector.alterAsync).toHaveBeenCalledWith("$alterRunInContext", stub);
    });
    it("should run handler in a context + bind", async () => {
      const context = new DIContext({
        event: {
          response: {},
          request: {url: "/admin"}
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
        expect(getAsyncStore().getStore()).toEqual({current: context});
      });

      expect(stub).toHaveBeenCalledWith();
      expect(context.injector.alterAsync).toHaveBeenCalledWith("$alterRunInContext", expect.any(Function));
    });
    it("should run handler in a context and fallback to next", async () => {
      const context = new DIContext({
        event: {
          response: {},
          request: {url: "/admin"}
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
      expect(context.injector.alterAsync).toHaveBeenCalledWith("$alterRunInContext", stub);
    });
  });
});
