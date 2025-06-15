import {describe, expect, it} from "vitest";

import {createFakeBackgroundEvent, createFakeHttpEvent} from "./createGCPContext.js";
import {getRequestId} from "./getRequestId.js";

describe("getRequestId", () => {
  describe("with HTTP event", () => {
    it("should get request ID from x-request-id header", () => {
      const httpEvent = createFakeHttpEvent();
      httpEvent.req.headers = {"x-request-id": "test-request-id"};

      const requestId = getRequestId(httpEvent);

      expect(requestId).toBe("test-request-id");
    });

    it("should get request ID from x-correlation-id header", () => {
      const httpEvent = createFakeHttpEvent();
      httpEvent.req.headers = {"x-correlation-id": "test-correlation-id"};

      const requestId = getRequestId(httpEvent);

      expect(requestId).toBe("test-correlation-id");
    });

    it("should handle array of header values", () => {
      const httpEvent = createFakeHttpEvent();
      httpEvent.req.headers = {"x-request-id": ["test-request-id-1", "test-request-id-2"]};

      const requestId = getRequestId(httpEvent);

      expect(requestId).toBe("test-request-id-1");
    });

    it("should generate a UUID if no request ID header is present", () => {
      const httpEvent = createFakeHttpEvent();
      httpEvent.req.headers = {};

      const requestId = getRequestId(httpEvent);

      expect(requestId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });
  });

  describe("with Background event", () => {
    it("should get request ID from event context", () => {
      const bgEvent = createFakeBackgroundEvent();
      bgEvent.context.eventId = "test-event-id";

      const requestId = getRequestId(bgEvent);

      expect(requestId).toBe("test-event-id");
    });

    it("should return the event ID even if it's empty", () => {
      const bgEvent = createFakeBackgroundEvent();
      bgEvent.context.eventId = "";

      const requestId = getRequestId(bgEvent);

      expect(requestId).toBe("");
    });

    it("should generate a UUID if event ID is undefined", () => {
      const bgEvent = createFakeBackgroundEvent();
      bgEvent.context.eventId = undefined;

      const requestId = getRequestId(bgEvent);

      expect(requestId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });
  });
});
