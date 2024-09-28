import {PlatformServerlessTest} from "@tsed/platform-serverless-testing";

import {createServerlessContext} from "../../test/utils/createServerlessContext.js";

describe("ServerlessResponse", () => {
  beforeEach(() => PlatformServerlessTest.create());
  afterEach(() => PlatformServerlessTest.reset());

  describe("isHeadersSent", () => {
    it("should push callback", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });
      expect(context.response.isHeadersSent).toEqual(false);

      context.response.destroy();

      expect(context.response.isHeadersSent).toEqual(true);
    });
  });
  describe("statusCode", () => {
    it("should return the statusCode", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });
      context.response.statusCode = 201;
      expect(context.response.statusCode).toEqual(201);
    });
  });
  describe("locals()", () => {
    it("should return the locals", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });

      expect(context.response.locals).toEqual({});
    });
  });
  describe("contentLength()", () => {
    it("should return the content length", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });
      context.response.contentLength(300);
      expect(context.response.getContentLength()).toEqual(300);
    });

    it("should return the default content length", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });
      context.response.contentLength(" " as any);
      expect(context.response.getContentLength()).toEqual(0);
    });
  });
  describe("location()", () => {
    it("should set location", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });

      context.response.location("/path/to");

      expect(context.response.getHeaders()).toEqual({
        location: "/path/to"
      });
    });
    it("should set location (back)", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });

      context.request.headers["Referrer"] = "https://referrer.com";
      context.response.location("back");

      expect(context.response.getHeaders()).toEqual({
        location: "https://referrer.com"
      });
    });
  });
  describe("redirect()", () => {
    it("should set location", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });

      context.response.redirect(301, "/path/to");

      expect(context.response.getHeaders()).toEqual({
        "content-length": 42,
        location: "/path/to"
      });
      expect(context.response.statusCode).toEqual(301);
      expect(context.response.getBody()).toEqual("Moved Permanently. Redirecting to /path/to");
    });
    it("should set location (back)", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });

      context.request.headers["Referrer"] = "https://referrer.com";
      context.response.redirect(301, "back");

      expect(context.response.getHeaders()).toEqual({
        "content-length": 54,
        location: "https://referrer.com"
      });
      expect(context.response.statusCode).toEqual(301);
      expect(context.response.getStatus()).toEqual(301);
      expect(context.response.getContentLength()).toEqual(54);
      expect(context.response.getContentType()).toEqual("");
      expect(context.response.getBody()).toEqual("Moved Permanently. Redirecting to https://referrer.com");
    });
  });
  describe("setHeader()", () => {
    it("should set location", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });

      context.event.headers["Referrer"] = "https://referrer.com";
      context.response.set("location", "back");
      expect(context.response.getHeaders()).toEqual({
        location: "https://referrer.com"
      });
    });
    it("should set location back with default value", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });

      context.event.headers["Referrer"] = "";
      context.response.set("location", "back");
      expect(context.response.getHeaders()).toEqual({
        location: "/"
      });
    });
  });
});
