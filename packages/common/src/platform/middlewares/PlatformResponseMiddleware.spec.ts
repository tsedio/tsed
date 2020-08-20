import {EndpointMetadata, Get, Ignore, PlatformResponse, PlatformResponseMiddleware, PlatformTest, Property} from "@tsed/common";
import {expect} from "chai";
import {createReadStream} from "fs";
import {join} from "path";
import * as Sinon from "sinon";
import {FakeResponse} from "../../../../../test/helper";
import {ABORT} from "../constants/abort";

const sandbox = Sinon.createSandbox();

function createContext(data: any) {
  class Test {
    @Get("/")
    test() {}
  }

  const response: any = new FakeResponse(sandbox);
  const ctx = PlatformTest.createRequestContext();

  ctx.data = data;
  ctx.endpoint = EndpointMetadata.get(Test, "test");
  ctx.response = new PlatformResponse(response);

  return ctx;
}

describe("PlatformResponseMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("render", () => {
    it("should call render before sending data", async () => {
      // GIVEN
      const ctx = createContext("data");
      ctx.endpoint.view = {path: "/path", options: {}};

      const middleware = await PlatformTest.invoke<PlatformResponseMiddleware>(PlatformResponseMiddleware);
      sandbox.stub(middleware.renderMiddleware, "use").resolves("html");

      // WHEN
      const result = await middleware.use(ctx);

      // THEN
      expect(result).to.eq(ABORT);
      expect(middleware.renderMiddleware.use).to.have.been.calledWithExactly("data", ctx.endpoint, ctx.response.raw);
      expect(ctx.response.raw.send).to.have.been.calledWithExactly("html");
    });
  });

  describe("when value is a stream", () => {
    it("should send the stream", async () => {
      // GIVEN
      const data = createReadStream(join(__dirname, "__mock__/response.data.json"));
      sandbox.stub(data, "pipe");

      const ctx = createContext(data);
      const middleware = await PlatformTest.invoke<PlatformResponseMiddleware>(PlatformResponseMiddleware);

      // WHEN
      const result = await middleware.use(ctx);

      // THEN
      expect(result).to.eq(ABORT);
      expect(data.pipe).to.have.been.calledWithExactly(ctx.response.raw);
    });
  });
  describe("when value is null", () => {
    it("should send empty response", async () => {
      // GIVEN
      const ctx = createContext(null);
      const middleware = await PlatformTest.invoke<PlatformResponseMiddleware>(PlatformResponseMiddleware);

      // WHEN
      const result = await middleware.use(ctx);

      // THEN
      expect(result).to.eq(ABORT);
      expect(ctx.response.raw.send).to.have.been.calledWithExactly(ctx.data);
    });
  });

  describe("when value is false", () => {
    it("should send response", async () => {
      // GIVEN
      const ctx = createContext(false);
      const middleware = await PlatformTest.invoke<PlatformResponseMiddleware>(PlatformResponseMiddleware);

      // WHEN
      const result = await middleware.use(ctx);

      // THEN
      expect(result).to.eq(ABORT);
      expect(ctx.response.raw.send).to.have.been.calledWithExactly(ctx.data);
    });
  });

  describe("when value is true", () => {
    it("should send response", async () => {
      // GIVEN
      const ctx = createContext(true);
      const middleware = await PlatformTest.invoke<PlatformResponseMiddleware>(PlatformResponseMiddleware);

      // WHEN
      const result = await middleware.use(ctx);

      // THEN
      expect(result).to.eq(ABORT);
      expect(ctx.response.raw.send).to.have.been.calledWithExactly(ctx.data);
    });
  });

  describe("when value is an empty string", () => {
    it("should send response", async () => {
      // GIVEN
      const ctx = createContext("");
      const middleware = await PlatformTest.invoke<PlatformResponseMiddleware>(PlatformResponseMiddleware);

      // WHEN
      const result = await middleware.use(ctx);

      // THEN
      expect(result).to.eq(ABORT);
      expect(ctx.response.raw.send).to.have.been.calledWithExactly(ctx.data);
    });
  });

  describe("when value is string", () => {
    it("should send response", async () => {
      // GIVEN
      const ctx = createContext("test");
      const middleware = await PlatformTest.invoke<PlatformResponseMiddleware>(PlatformResponseMiddleware);

      // WHEN
      const result = await middleware.use(ctx);

      // THEN
      expect(result).to.eq(ABORT);
      expect(ctx.response.raw.send).to.have.been.calledWithExactly(ctx.data);
    });
  });

  describe("when value is a number", () => {
    it("should send response", async () => {
      // GIVEN
      const ctx = createContext(1);
      const middleware = await PlatformTest.invoke<PlatformResponseMiddleware>(PlatformResponseMiddleware);

      // WHEN
      const result = await middleware.use(ctx);

      // THEN
      expect(result).to.eq(ABORT);
      expect(ctx.response.raw.send).to.have.been.calledWithExactly(ctx.data);
    });
  });

  describe("when value is an object", () => {
    it("should send response", async () => {
      // GIVEN
      const ctx = createContext({data: "data"});
      const middleware = await PlatformTest.invoke<PlatformResponseMiddleware>(PlatformResponseMiddleware);

      // WHEN
      const result = await middleware.use(ctx);

      // THEN
      expect(result).to.eq(ABORT);
      expect(ctx.response.raw.json).to.have.been.calledWithExactly(ctx.data);
    });
  });

  describe("when value is an object and endpoint type is used", () => {
    it("should send response", async () => {
      // GIVEN
      class Test {
        @Property()
        data: string;

        @Ignore()
        test: string;
      }

      const ctx = createContext({data: "data", test: "test"});
      ctx.endpoint.response.type = Test;

      const middleware = await PlatformTest.invoke<PlatformResponseMiddleware>(PlatformResponseMiddleware);

      // WHEN
      const result = await middleware.use(ctx);

      // THEN
      expect(result).to.eq(ABORT);
      expect(ctx.response.raw.json).to.have.been.calledWithExactly({data: "data"});
    });
  });

  describe("when value is an array", () => {
    it("should send response", async () => {
      // GIVEN
      const ctx = createContext([{data: "data"}]);
      const middleware = await PlatformTest.invoke<PlatformResponseMiddleware>(PlatformResponseMiddleware);

      // WHEN
      const result = await middleware.use(ctx);

      // THEN
      expect(result).to.eq(ABORT);
      expect(ctx.response.raw.json).to.have.been.calledWithExactly(ctx.data);
    });
  });

  describe("when value is a date", () => {
    it("should send response", async () => {
      // GIVEN
      const ctx = createContext(new Date("2019-01-01"));
      const middleware = await PlatformTest.invoke<PlatformResponseMiddleware>(PlatformResponseMiddleware);

      // WHEN
      const result = await middleware.use(ctx);

      // THEN
      expect(result).to.eq(ABORT);
      expect(ctx.response.raw.send).to.have.been.calledWithExactly("2019-01-01T00:00:00.000Z");
    });
  });
});
