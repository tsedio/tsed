import {catchAsyncError} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {PlatformHandlerMetadata, PlatformHandlerType} from "@tsed/platform-router";
import {EndpointMetadata, Get, View} from "@tsed/schema";
import {createReadStream} from "fs";
import {join} from "path";
import {PlatformHandler} from "./PlatformHandler";
import {PlatformTest} from "./PlatformTest";

function getServiceFixture() {
  const service = PlatformTest.get<PlatformHandler>(PlatformHandler);
  return {service};
}

describe("PlatformHandler", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.create());

  describe("createHandler()", () => {
    it("should create handler", async () => {
      const {service} = getServiceFixture();
      const handler = jest.fn();
      const metadata = new PlatformHandlerMetadata({
        handler,
        type: PlatformHandlerType.CTX_FN
      });

      const $ctx = PlatformTest.createRequestContext();

      const result = service.createHandler(metadata);

      expect(typeof result).toEqual("function");

      await new Promise((resolve) => {
        $ctx.next = resolve;

        result($ctx);
      });

      expect(handler).toHaveBeenCalledWith($ctx);
    });
    it("should create handler from provider", async () => {
      const {service} = getServiceFixture();

      @Injectable()
      class Test {
        @Get("/")
        get() {
          return "test";
        }
      }

      PlatformTest.injector.addProvider(Test);

      const metadata = new PlatformHandlerMetadata({
        provider: PlatformTest.injector.getProvider(Test),
        propertyKey: "get",
        type: PlatformHandlerType.ENDPOINT
      });

      const $ctx = PlatformTest.createRequestContext();

      const result = service.createHandler(metadata);

      expect(typeof result).toEqual("function");

      await new Promise((resolve) => {
        $ctx.next = resolve;

        result($ctx);
      });

      expect($ctx.data).toEqual("test");
    });
  });
  describe("createCustomHandler()", () => {
    it("should create handler", async () => {
      @Injectable()
      class TestService {
        @View("test")
        async use() {
          return "hello";
        }
      }

      const {service} = getServiceFixture();

      const $ctx = PlatformTest.createRequestContext();
      const testService = await PlatformTest.invoke<TestService>(TestService)!;
      const provider = PlatformTest.injector.getProvider(TestService)!;

      jest.spyOn(testService, "use").mockResolvedValue("hello");

      const result = service.createCustomHandler(provider, "use");

      expect(result).toBeInstanceOf(Function);

      await $ctx.runInContext(() => result($ctx));

      expect($ctx.data).toEqual("hello");
      expect(testService.use).toHaveBeenCalledWith($ctx);
    });
  });
  describe("next()", () => {
    it("should call next", async () => {
      const {service} = getServiceFixture();

      const $ctx = PlatformTest.createRequestContext();
      $ctx.next = jest.fn();

      await service.next($ctx);

      expect($ctx.next).toHaveBeenCalledWith();
    });
    it("should call next with error", async () => {
      const {service} = getServiceFixture();

      const $ctx = PlatformTest.createRequestContext();
      $ctx.next = jest.fn();
      $ctx.error = new Error();

      await service.next($ctx);

      expect($ctx.next).toHaveBeenCalledWith($ctx.error);
    });
    it("should not call next when the data is a stream", async () => {
      const {service} = getServiceFixture();

      const $ctx = PlatformTest.createRequestContext();
      $ctx.next = jest.fn();
      $ctx.data = createReadStream(join(__dirname, "__mock__/data.txt"));

      await service.next($ctx);

      expect($ctx.next).not.toHaveBeenCalled();
    });
    it("should not call next when the request is done", async () => {
      const {service} = getServiceFixture();

      const $ctx = PlatformTest.createRequestContext();
      $ctx.next = jest.fn();

      await $ctx.finish();

      await service.next($ctx);

      expect($ctx.next).not.toHaveBeenCalled();
    });
  });
  describe("onRequest()", () => {
    it("should do nothing when the handler is not an error handler", async () => {
      const {service} = getServiceFixture();
      const handler = jest.fn();

      const $ctx = PlatformTest.createRequestContext();
      $ctx.next = jest.fn();
      $ctx.error = new Error("");

      $ctx.handlerMetadata = new PlatformHandlerMetadata({
        handler
      });

      await service.onRequest(handler, $ctx);

      expect(handler).not.toHaveBeenCalled();
    });
    it("should do nothing when the request is done", async () => {
      const {service} = getServiceFixture();
      const handler = jest.fn();

      const $ctx = PlatformTest.createRequestContext();
      $ctx.next = jest.fn();

      await $ctx.finish();

      $ctx.handlerMetadata = new PlatformHandlerMetadata({
        handler
      });

      await service.onRequest(handler, $ctx);

      expect(handler).not.toHaveBeenCalled();
    });
    it("should catch error", async () => {
      const {service} = getServiceFixture();
      const error = new Error("message");
      const handler = jest.fn().mockRejectedValue(error);

      const $ctx = PlatformTest.createRequestContext();
      $ctx.next = jest.fn();

      $ctx.handlerMetadata = new PlatformHandlerMetadata({
        handler
      });

      const err = await catchAsyncError(() => service.onRequest(handler, $ctx));

      expect(handler).toHaveBeenCalled();
      expect($ctx.error).toEqual(error);
      expect(err).toEqual(error);
    });
    it("should apply headers and status", async () => {
      @Injectable()
      class TestService {
        @Get("/")
        async use() {
          return "hello";
        }
      }

      const {service} = getServiceFixture();
      const handler = jest.fn().mockResolvedValue({
        status: 201,
        statusText: "CREATED",
        headers: {
          test: "test"
        },
        data: "data"
      });

      const $ctx = PlatformTest.createRequestContext();
      $ctx.next = jest.fn();
      $ctx.endpoint = EndpointMetadata.get(TestService, "use");

      $ctx.handlerMetadata = new PlatformHandlerMetadata({
        handler: TestService.prototype.use
      });

      jest.spyOn(service, "flush").mockResolvedValue();

      await service.onRequest(handler, $ctx);

      expect(handler).toHaveBeenCalled();
      expect($ctx.response.statusCode).toEqual(201);
      expect($ctx.response.getHeaders()).toEqual({
        test: "test",
        "x-request-id": "id"
      });
    });
    it("should call the returned middleware", async () => {
      @Injectable()
      class TestService {
        @Get("/")
        async use() {
          return "hello";
        }
      }

      const {service} = getServiceFixture();
      const middleware = jest.fn().mockImplementation((_1, _2, next) => next());
      const handler = jest.fn().mockResolvedValue(middleware);

      const $ctx = PlatformTest.createRequestContext();
      $ctx.next = jest.fn();
      $ctx.data = middleware;

      $ctx.endpoint = EndpointMetadata.get(TestService, "use");

      $ctx.handlerMetadata = new PlatformHandlerMetadata({
        handler: TestService.prototype.use
      });

      jest.spyOn(service, "flush").mockResolvedValue();

      await service.onRequest(handler, $ctx);

      expect(handler).toHaveBeenCalled();
      expect(middleware).toHaveBeenCalled();
    });
    it("should not call flush when is a stream", async () => {
      @Injectable()
      class TestService {
        @Get("/")
        async use() {
          return "hello";
        }
      }

      const {service} = getServiceFixture();
      const data = createReadStream(join(__dirname, "__mock__/data.txt"));
      const handler = jest.fn().mockResolvedValue(data);

      const $ctx = PlatformTest.createRequestContext();
      $ctx.next = jest.fn();
      $ctx.endpoint = EndpointMetadata.get(TestService, "use");

      $ctx.handlerMetadata = new PlatformHandlerMetadata({
        handler: TestService.prototype.use
      });

      jest.spyOn(service, "flush").mockResolvedValue();

      await service.onRequest(handler, $ctx);

      expect(handler).toHaveBeenCalled();
      expect(service.flush).toHaveBeenCalledWith($ctx);
    });
  });
});
