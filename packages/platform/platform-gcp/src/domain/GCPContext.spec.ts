import {describe, expect, it} from "vitest";

import {createFakeBackgroundEvent, createFakeHttpEvent, createGCPContext} from "../utils/createGCPContext.js";
import {GCPContext} from "./GCPContext.js";

describe("GCPContext", () => {
  describe("with HTTP event", () => {
    it("should create a context with HTTP event", () => {
      const event = createFakeHttpEvent();
      const context = createGCPContext({event});

      expect(context).toBeInstanceOf(GCPContext);
      expect(context.event).toBe(event);
      expect(context.isHttpEvent()).toBe(true);
      expect(context.isBackgroundEvent()).toBe(false);
    });

    it("should have request and response objects", () => {
      const context = createGCPContext({event: createFakeHttpEvent()});

      expect(context.request).toBeDefined();
      expect(context.response).toBeDefined();
    });
  });

  describe("with Background event", () => {
    it("should create a context with Background event", () => {
      const event = createFakeBackgroundEvent();
      const context = createGCPContext({event});

      expect(context).toBeInstanceOf(GCPContext);
      expect(context.event).toBe(event);
      expect(context.isHttpEvent()).toBe(false);
      expect(context.isBackgroundEvent()).toBe(true);
    });

    it("should have request and response objects", () => {
      const context = createGCPContext({event: createFakeBackgroundEvent()});

      expect(context.request).toBeDefined();
      expect(context.response).toBeDefined();
    });
  });

  describe("destroy()", () => {
    it("should call destroy on response", async () => {
      const context = createGCPContext();
      const spy = vi.spyOn(context.response, "destroy");

      await context.destroy();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe("isDone()", () => {
    it("should return response.isDone()", () => {
      const context = createGCPContext();
      const spy = vi.spyOn(context.response, "isDone").mockReturnValue(true);

      expect(context.isDone()).toBe(true);
      expect(spy).toHaveBeenCalled();
    });
  });
});
