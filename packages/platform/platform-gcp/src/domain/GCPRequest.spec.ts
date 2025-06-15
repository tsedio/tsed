import {describe, expect, it} from "vitest";

import {createFakeBackgroundEvent, createFakeHttpEvent, createGCPContext} from "../utils/createGCPContext.js";
import {GCPRequest} from "./GCPRequest.js";

describe("GCPRequest", () => {
  describe("with HTTP event", () => {
    it("should create a request with HTTP event", () => {
      const context = createGCPContext({event: createFakeHttpEvent()});
      const request = context.request;

      expect(request).toBeInstanceOf(GCPRequest);
      expect(request.event).toBe(context.event);
    });

    it("should return correct properties", () => {
      const httpEvent = createFakeHttpEvent();
      httpEvent.req.method = "POST";
      httpEvent.req.url = "/test";
      httpEvent.req.path = "/test";
      httpEvent.req.headers = {"content-type": "application/json"};
      httpEvent.req.query = {page: "1"};
      httpEvent.req.params = {id: "123"};
      httpEvent.req.body = {name: "test"};
      httpEvent.req.secure = true;
      httpEvent.req.protocol = "https";
      httpEvent.req.hostname = "example.com";

      const context = createGCPContext({event: httpEvent});
      const request = context.request;

      expect(request.method).toBe("POST");
      expect(request.url).toBe("/test");
      expect(request.headers).toEqual({"content-type": "application/json"});
      expect(request.query).toEqual({page: "1"});
      expect(request.params).toEqual({id: "123"});
      expect(request.body).toEqual({name: "test"});
      expect(request.rawBody).toEqual({name: "test"});
      expect(request.secure).toBe(true);
      expect(request.protocol).toBe("https");
      expect(request.host).toBe("example.com");
    });

    it("should get header by name", () => {
      const httpEvent = createFakeHttpEvent();
      httpEvent.req.headers = {"content-type": "application/json", "x-request-id": "123"};

      const context = createGCPContext({event: httpEvent});
      const request = context.request;

      expect(request.get("content-type")).toBe("application/json");
      expect(request.get("x-request-id")).toBe("123");
      expect(request.get("not-exist")).toBeUndefined();
    });
  });

  describe("with Background event", () => {
    it("should create a request with Background event", () => {
      const context = createGCPContext({event: createFakeBackgroundEvent()});
      const request = context.request;

      expect(request).toBeInstanceOf(GCPRequest);
      expect(request.event).toBe(context.event);
    });

    it("should return default values for HTTP properties", () => {
      const context = createGCPContext({event: createFakeBackgroundEvent()});
      const request = context.request;

      expect(request.method).toBe("");
      expect(request.url).toBe("");
      expect(request.headers).toEqual({});
      expect(request.query).toEqual({});
      expect(request.params).toEqual({});
      expect(request.secure).toBe(true);
      expect(request.protocol).toBe("https");
      expect(request.host).toBe("");
    });

    it("should return the event as body", () => {
      const bgEvent = createFakeBackgroundEvent();
      const context = createGCPContext({event: bgEvent});
      const request = context.request;

      expect(request.body).toBe(bgEvent);
      expect(request.rawBody).toBe(bgEvent);
    });

    it("should return undefined for get header", () => {
      const context = createGCPContext({event: createFakeBackgroundEvent()});
      const request = context.request;

      expect(request.get("any-header")).toBeUndefined();
    });
  });
});
