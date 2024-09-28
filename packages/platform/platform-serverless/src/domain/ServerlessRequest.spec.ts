import {PlatformServerlessTest} from "@tsed/platform-serverless-testing";

import {createServerlessContext} from "../../test/utils/createServerlessContext.js";

describe("ServerlessRequest", () => {
  beforeEach(() => PlatformServerlessTest.create());
  afterEach(() => PlatformServerlessTest.reset());
  describe("secure()", () => {
    it("should return expected value", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });

      expect(context.request.secure).toEqual(true);
    });
  });

  describe("host()", () => {
    it("should return expected value", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });
      context.event.headers["host"] = "host";

      expect(context.request.host).toEqual("host");
    });
  });
  describe("protocol()", () => {
    it("should return expected value", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });

      expect(context.request.protocol).toEqual("https");
    });
  });
  describe("url()", () => {
    it("should return expected value", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });

      expect(context.request.url).toEqual("/");
    });
  });
  describe("headers()", () => {
    it("should return expected value", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });

      expect(context.request.headers).toEqual({});
    });
  });
  describe("method()", () => {
    it("should return expected value", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });
      context.request.raw.httpMethod = "GET";
      expect(context.request.method).toEqual("GET");
    });
  });

  describe("body()", () => {
    it("should return expected value", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });

      expect(context.request.body).toEqual({});
    });
    it("should return catch error on body", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });
      context.request.raw.body = "{";

      expect(context.request.body).toEqual("{");
    });
    it("should return parse body", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });
      context.request.raw.body = "{}";

      expect(context.request.body).toEqual({});
    });
  });

  describe("rawBody()", () => {
    it("should return expected value", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });

      expect(context.request.rawBody).toEqual("");
    });
  });

  describe("params()", () => {
    it("should return expected value", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });

      expect(context.request.params).toEqual({});
    });

    it("should return expected value (undefined params)", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });

      delete context.event.pathParameters;

      expect(context.request.params).toEqual({});
    });
  });

  describe("query()", () => {
    it("should return expected value", () => {
      const context = createServerlessContext({
        endpoint: {} as any
      });

      expect(context.request.query).toEqual({});
    });
  });
});
