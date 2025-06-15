import {AnyPromiseResult} from "@tsed/core";
import {PlatformParams} from "@tsed/platform-params";
import {beforeEach, describe, expect, it, vi} from "vitest";

import {createFakeBackgroundEvent, createFakeHttpEvent, createGCPContext} from "../utils/createGCPContext.js";
import {PlatformGCPHandler} from "./PlatformGCPHandler.js";

describe("PlatformGCPHandler", () => {
  let handler: PlatformGCPHandler;
  let platformParams: PlatformParams;

  beforeEach(() => {
    platformParams = {
      compileHandler: vi.fn()
    } as any;

    handler = new PlatformGCPHandler();
    (handler as any).params = platformParams;
  });

  describe("createHandler()", () => {
    it("should create a handler function", () => {
      const token = {};
      const propertyKey = "method";
      const compiledHandler = vi.fn();

      platformParams.compileHandler.mockResolvedValue(compiledHandler);

      const result = handler.createHandler(token, propertyKey);

      expect(typeof result).toBe("function");
      expect(platformParams.compileHandler).toHaveBeenCalledWith({token, propertyKey});
    });

    it("should handle HTTP requests", async () => {
      const token = {};
      const propertyKey = "method";
      const compiledHandler = vi.fn().mockResolvedValue({
        status: 200,
        headers: {"content-type": "application/json"},
        data: {success: true}
      });

      platformParams.compileHandler.mockResolvedValue(compiledHandler);

      const handlerFn = handler.createHandler(token, propertyKey);
      const context = createGCPContext({event: createFakeHttpEvent()});

      // Mock $asyncEmit
      vi.mock("@tsed/hooks", () => ({
        $asyncEmit: vi.fn()
      }));

      // Mock processResult
      const processResultSpy = vi.spyOn(handler as any, "processResult");

      // Mock makeHttpResponse
      const makeHttpResponseSpy = vi.spyOn(handler as any, "makeHttpResponse").mockResolvedValue(undefined);

      await handlerFn(context);

      expect(compiledHandler).toHaveBeenCalledWith({$ctx: context});
      expect(processResultSpy).toHaveBeenCalledWith(
        {status: 200, headers: {"content-type": "application/json"}, data: {success: true}},
        context
      );
      expect(makeHttpResponseSpy).toHaveBeenCalledWith(context);
    });

    it("should handle background requests", async () => {
      const token = {};
      const propertyKey = "method";
      const compiledHandler = vi.fn().mockResolvedValue({
        status: 200,
        headers: {"content-type": "application/json"},
        data: {success: true}
      });

      platformParams.compileHandler.mockResolvedValue(compiledHandler);

      const handlerFn = handler.createHandler(token, propertyKey);
      const context = createGCPContext({event: createFakeBackgroundEvent()});

      // Mock isHttpEvent to return false
      vi.spyOn(context, "isHttpEvent").mockReturnValue(false);

      // Mock $asyncEmit
      vi.mock("@tsed/hooks", () => ({
        $asyncEmit: vi.fn()
      }));

      // Mock processResult
      const processResultSpy = vi.spyOn(handler as any, "processResult");

      const result = await handlerFn(context);

      expect(compiledHandler).toHaveBeenCalledWith({$ctx: context});
      expect(processResultSpy).toHaveBeenCalledWith(
        {status: 200, headers: {"content-type": "application/json"}, data: {success: true}},
        context
      );
      expect(result).toEqual({success: true});
    });

    it("should handle errors", async () => {
      const token = {};
      const propertyKey = "method";
      const error = new Error("Test error");
      const compiledHandler = vi.fn().mockRejectedValue(error);

      vi.mocked(platformParams.compileHandler).mockResolvedValue(compiledHandler);

      const handlerFn = handler.createHandler(token, propertyKey);
      const context = createGCPContext();

      // Mock $asyncEmit
      vi.mock("@tsed/hooks", () => ({
        $asyncEmit: vi.fn()
      }));

      // Mock lazyInject
      vi.mock("@tsed/di", async () => {
        const actual = await vi.importActual("@tsed/di");
        return {
          ...actual,
          lazyInject: vi.fn().mockResolvedValue({
            catch: vi.fn()
          })
        };
      });

      // Mock response.status and response.body
      const statusSpy = vi.spyOn(context.response, "status").mockReturnThis();
      const bodySpy = vi.spyOn(context.response, "body");

      await handlerFn(context);

      expect(compiledHandler).toHaveBeenCalledWith({$ctx: context});
      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(bodySpy).toHaveBeenCalledWith(error);
    });
  });

  describe("processResult()", () => {
    it("should set status, headers, and body", () => {
      const context = createGCPContext();
      const result: AnyPromiseResult = {
        status: 201,
        headers: {"content-type": "application/json"},
        data: {success: true}
      };

      // Mock response methods
      const statusSpy = vi.spyOn(context.response, "status").mockReturnThis();
      const setHeadersSpy = vi.spyOn(context.response, "setHeaders");
      const bodySpy = vi.spyOn(context.response, "body");

      // Mock endpoint.getResponseOptions
      vi.spyOn(context.endpoint, "getResponseOptions").mockReturnValue({});

      (handler as any).processResult(result, context);

      expect(statusSpy).toHaveBeenCalledWith(201);
      expect(setHeadersSpy).toHaveBeenCalledWith({"content-type": "application/json"});
      expect(bodySpy).toHaveBeenCalledWith({success: true});
    });

    it("should not set body for 204 status", () => {
      const context = createGCPContext();
      const result: AnyPromiseResult = {
        status: 204,
        headers: {"content-type": "application/json"},
        data: {success: true}
      };

      // Mock response methods
      vi.spyOn(context.response, "status").mockReturnThis();
      vi.spyOn(context.response, "setHeaders");
      const bodySpy = vi.spyOn(context.response, "body");
      vi.spyOn(context.response, "getStatus").mockReturnValue(204);

      (handler as any).processResult(result, context);

      expect(bodySpy).toHaveBeenCalledWith("");
    });
  });
});
