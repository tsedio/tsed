import {EndpointMetadata, Get, PlatformResponse, PlatformResponseMiddleware, PlatformTest, View} from "@tsed/common";
import {Ignore, Property, Returns} from "@tsed/schema";
import {expect} from "chai";
import {createReadStream} from "fs";
import {join} from "path";
import * as Sinon from "sinon";
import {FakeResponse} from "../../../../../test/helper";
import {ABORT} from "../constants/abort";

const sandbox = Sinon.createSandbox();

function createContext(data: any, model?: any) {
  class Test {
    @Get("/")
    @Returns(200, model)
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

  it("should render content", async () => {
    class Model {
      @Property()
      data: string;

      @Ignore()
      test: string;
    }

    class Test {
      @Get("/")
      @View("view", {options: "options"})
      @Returns(200, Model)
      test() {}
    }

    const response: any = new FakeResponse(sandbox);
    const ctx = PlatformTest.createRequestContext();

    ctx.endpoint = EndpointMetadata.get(Test, "test");
    ctx.response = new PlatformResponse(response);

    sandbox.stub(ctx.response, "render").resolves("HTML");

    const middleware = await PlatformTest.invoke<PlatformResponseMiddleware>(PlatformResponseMiddleware);
    ctx.data = {data: "data"};

    await middleware.use(ctx);
    expect(ctx.response.render).to.have.been.calledWithExactly("view", {
      data: "data",
      options: "options"
    });
    expect(ctx.response.raw.send).to.have.been.calledWithExactly("HTML");
    expect(ctx.response.raw.contentType).not.to.have.been.called;
  });
  it("should render content with the appropriate content type", async () => {
    class Model {
      @Property()
      data: string;

      @Ignore()
      test: string;
    }

    class Test {
      @Get("/")
      @View("view", {options: "options"})
      @(Returns(200).ContentType("text/html"))
      test() {}
    }

    const response: any = new FakeResponse(sandbox);
    const ctx = PlatformTest.createRequestContext();

    ctx.endpoint = EndpointMetadata.get(Test, "test");
    ctx.response = new PlatformResponse(response);

    sandbox.stub(ctx.response, "render").resolves("HTML");

    const middleware = await PlatformTest.invoke<PlatformResponseMiddleware>(PlatformResponseMiddleware);
    ctx.data = {data: "data"};

    await middleware.use(ctx);
    expect(ctx.response.render).to.have.been.calledWithExactly("view", {
      data: "data",
      options: "options"
    });
    expect(ctx.response.raw.send).to.have.been.calledWithExactly("HTML");
    expect(ctx.response.raw.contentType).to.have.been.calledWithExactly("text/html");
  });
  it("should throw an error", async () => {
    class Test {
      @Get("/")
      @View("view", {options: "options"})
      test() {}
    }

    const response: any = new FakeResponse(sandbox);
    const ctx = PlatformTest.createRequestContext();

    ctx.endpoint = EndpointMetadata.get(Test, "test");
    ctx.response = new PlatformResponse(response);
    sandbox.stub(ctx.response, "render").callsFake(() => {
      throw new Error("parser error");
    });

    const middleware = await PlatformTest.invoke<PlatformResponseMiddleware>(PlatformResponseMiddleware);
    ctx.data = {data: "data"};

    let actualError: any;
    try {
      await middleware.use(ctx);
    } catch (er) {
      actualError = er;
    }

    expect(actualError.message).to.equal("Template rendering error: Test.test()\nError: parser error");
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
      expect(ctx.response.raw.contentType).not.to.have.been.called;
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
      expect(ctx.response.raw.contentType).not.to.have.been.called;
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
      expect(ctx.response.raw.contentType).not.to.have.been.called;
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
      expect(ctx.response.raw.contentType).not.to.have.been.called;
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
      expect(ctx.response.raw.contentType).not.to.have.been.called;
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
      expect(ctx.response.raw.contentType).not.to.have.been.called;
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
      expect(ctx.response.raw.contentType).not.to.have.been.called;
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
      expect(ctx.response.raw.contentType).not.to.have.been.called;
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

      const ctx = createContext({data: "data", test: "test"}, Test);

      const middleware = await PlatformTest.invoke<PlatformResponseMiddleware>(PlatformResponseMiddleware);

      // WHEN
      const result = await middleware.use(ctx);

      // THEN
      expect(result).to.eq(ABORT);
      expect(ctx.response.raw.json).to.have.been.calledWithExactly({data: "data"});
      expect(ctx.response.raw.contentType).to.have.been.calledWithExactly("application/json");
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
      expect(ctx.response.raw.contentType).not.to.have.been.called;
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
      expect(ctx.response.raw.contentType).not.to.have.been.called;
    });
  });
});
