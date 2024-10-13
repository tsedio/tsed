import {logger} from "../fn/logger.js";
import {DITest} from "../services/DITest.js";
import {bindContext, getAsyncStore} from "../utils/asyncHookContext.js";
import {DIContext} from "./DIContext.js";

describe("DIContext", () => {
  beforeEach(() => DITest.create());
  beforeEach(() => {
    vi.spyOn(logger(), "info").mockReturnValue(undefined);
  });
  afterEach(() => DITest.reset());
  describe("constructor", () => {
    it("should create a new Context and skip log", () => {
      const context = new DIContext({
        event: {
          response: {},
          request: {
            url: "/admin"
          }
        },
        id: "id",
        maxStackSize: 0
      });

      expect(context.id).toEqual("id");
      expect(context.dateStart).toBeInstanceOf(Date);
      expect(context.container).toBeInstanceOf(Map);
      expect(context.env).toEqual("test");
      expect(context.PLATFORM).toEqual("DI");

      context.logger.info("test");

      expect(logger().info).toHaveBeenCalled();

      context.destroy();
    });
    it("should create a new Context and log event", () => {
      const context = new DIContext({
        id: "id",
        event: {
          response: {},
          request: {url: "/"}
        },
        maxStackSize: 0,
        platform: "OTHER"
      });

      context.next = vi.fn();

      expect(context.id).toEqual("id");
      expect(context.dateStart).toBeInstanceOf(Date);
      expect(context.container).toBeInstanceOf(Map);
      expect(context.env).toEqual("test");
      expect(context.PLATFORM).toEqual("OTHER");

      context.next();
      context.logger.info("test");

      expect(logger().info).toHaveBeenCalled();
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
        maxStackSize: 0,
        ignoreUrlPatterns: ["/admin", /\/admin2/]
      });
      const resolver = vi.fn().mockReturnValue("test");

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
        maxStackSize: 0,
        ignoreUrlPatterns: ["/admin", /\/admin2/]
      });
      const resolver = vi.fn().mockResolvedValue("test");

      const result = await context.cacheAsync("key", resolver);
      const result2 = await context.cacheAsync("key", resolver);

      expect(result).toEqual(result2);
      expect(resolver).toHaveBeenCalledTimes(1);
    });
  });
});
