import {Controller, Inject, Injectable} from "@tsed/di";
import {BodyParams, PathParams, QueryParams} from "@tsed/platform-params";
import {Delete, Get, Patch, Post, Put} from "@tsed/schema";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {GCPFunction} from "../exports.js";
import {createFakeBackgroundEvent, createFakeHttpEvent} from "../utils/createGCPContext.js";
import {PlatformGCP} from "./PlatformGCP.js";

@Injectable()
class FunctionsService {
  get() {
    return {value: "test"};
  }
}

@Controller("/functions")
class FunctionsController {
  @Inject()
  protected service: FunctionsService;

  @Get("/:id")
  @GCPFunction()
  getByID(@PathParams("id") id: string) {
    return {
      id
    };
  }

  @Get("/")
  @GCPFunction()
  get(@QueryParams("start_date") startDate: Date, @QueryParams("end_date") endDate: Date) {
    return {
      startDate,
      endDate,
      ...this.service.get()
    };
  }

  @Post("/")
  post(@BodyParams() body: any) {
    return body;
  }

  @Put("/:id")
  put(@BodyParams() body: any) {
    return body;
  }

  @Patch("/:id")
  patch(@BodyParams() body: any) {
    return body;
  }

  @Delete("/:id")
  delete(@BodyParams() body: any) {
    return body;
  }

  other() {}
}

describe("PlatformGCP", () => {
  describe("bootstrap()", () => {
    let platform: PlatformGCP;

    beforeEach(() => {
      platform = PlatformGCP.bootstrap({
        gcpFunctions: [FunctionsController]
      });
    });

    afterEach(async () => {
      await platform.stop();
    });

    it("should create a platform instance", () => {
      expect(platform).toBeInstanceOf(PlatformGCP);
      expect(platform.name).toBe("PlatformGCP");
    });

    it("should have injector", () => {
      expect(platform.injector).toBeDefined();
    });

    it("should have settings", () => {
      expect(platform.settings).toBeDefined();
    });
  });

  describe("callback()", () => {
    it("should create a callback function", () => {
      const callback = PlatformGCP.callback(FunctionsController, "get");

      expect(typeof callback).toBe("function");
    });
  });

  describe("handler()", () => {
    let platform: PlatformGCP;

    beforeEach(() => {
      platform = PlatformGCP.bootstrap({
        gcpFunctions: [FunctionsController]
      });
    });

    afterEach(async () => {
      await platform.stop();
    });

    it("should create a handler function", () => {
      const handler = platform.handler();

      expect(typeof handler).toBe("function");
    });

    it("should handle HTTP events", async () => {
      const handler = platform.handler();
      const httpEvent = createFakeHttpEvent();
      httpEvent.req.method = "GET";
      httpEvent.req.path = "/functions";
      httpEvent.req.query = {
        start_date: new Date("2020-01-01").toISOString(),
        end_date: new Date("2020-01-10").toISOString()
      };

      // Mock router.find to return a handler
      vi.spyOn(platform as any, "initRouter").mockResolvedValue({
        find: () => ({
          handler: vi.fn(),
          params: {}
        })
      });

      await handler(httpEvent);

      expect(httpEvent.res.status).toHaveBeenCalled();
    });

    it("should handle 404 for HTTP events", async () => {
      const handler = platform.handler();
      const httpEvent = createFakeHttpEvent();
      httpEvent.req.method = "GET";
      httpEvent.req.path = "/not-found";

      // Mock router.find to return null
      vi.spyOn(platform as any, "initRouter").mockResolvedValue({
        find: () => null
      });

      await handler(httpEvent);

      expect(httpEvent.res.status).toHaveBeenCalledWith(404);
      expect(httpEvent.res.send).toHaveBeenCalledWith("Not found");
    });

    it("should handle background events", async () => {
      const handler = platform.handler();
      const bgEvent = createFakeBackgroundEvent();

      // Mock router.find
      vi.spyOn(platform as any, "initRouter").mockResolvedValue({
        find: () => null
      });

      const result = await handler(bgEvent);

      expect(result).toEqual({
        statusCode: 404,
        body: "Not found",
        headers: {
          "x-request-id": expect.any(String)
        }
      });
    });
  });

  describe("callbacks()", () => {
    let platform: PlatformGCP;

    beforeEach(() => {
      platform = PlatformGCP.bootstrap({
        gcpFunctions: [FunctionsController]
      });
    });

    afterEach(async () => {
      await platform.stop();
    });

    it("should return callbacks for all functions", () => {
      const callbacks = platform.callbacks();

      expect(callbacks).toHaveProperty("get");
      expect(callbacks).toHaveProperty("getByID");
    });

    it("should add routes to router", () => {
      const routerSpy = {
        on: vi.fn()
      };
      (platform as any)._router = routerSpy;

      platform.callbacks();

      expect(routerSpy.on).toHaveBeenCalled();
    });
  });
});
