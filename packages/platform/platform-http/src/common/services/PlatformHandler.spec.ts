import {Get, s, View} from "@tsed/schema";
import {Injectable, runInContext} from "@tsed/di";
import {PlatformHandlerMetadata, PlatformHandlerType} from "@tsed/platform-router";
import {PlatformHandler} from "./PlatformHandler.js";
import {PlatformTest} from "../../testing/PlatformTest.js";

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
      const handler = vi.fn();
      const metadata = new PlatformHandlerMetadata({
        handler,
        type: PlatformHandlerType.CTX_FN
      });

      const $ctx = PlatformTest.createRequestContext();

      const result = service.createHandler(metadata);

      expect(typeof result).toEqual("function");

      await result($ctx);

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

      PlatformTest.injector.add(Test);

      const metadata = new PlatformHandlerMetadata({
        provider: PlatformTest.injector.providers.get(Test),
        propertyKey: "get",
        type: PlatformHandlerType.ENDPOINT
      });

      const $ctx = PlatformTest.createRequestContext();
      $ctx.endpoint = s.store.method(Test, "get");

      const result = service.createHandler(metadata);

      expect(typeof result).toEqual("function");

      await result($ctx);

      expect($ctx.data).toEqual("test");
    });
  });
  describe("createCustomHandler()", () => {
    it("should create handler", async () => {
      @Injectable()
      class TestService {
        @View("test")
        use() {
          return Promise.resolve("hello");
        }
      }

      const {service} = getServiceFixture();

      const $ctx = PlatformTest.createRequestContext();
      const testService = await PlatformTest.invoke<TestService>(TestService)!;
      const provider = PlatformTest.injector.providers.get(TestService)!;

      vi.spyOn(testService, "use").mockResolvedValue("hello");

      const result = service.createCustomHandler(provider, "use");

      expect(result).toBeInstanceOf(Function);

      await runInContext($ctx, () => result($ctx));

      expect($ctx.data).toEqual("hello");
      expect(testService.use).toHaveBeenCalledWith($ctx);
    });
  });
  describe("onRequest()", () => {
    it("should do nothing when the request is done", async () => {
      const {service} = getServiceFixture();
      const handler = vi.fn();

      const $ctx = PlatformTest.createRequestContext();
      $ctx.next = vi.fn();

      await $ctx.finish();

      $ctx.handlerMetadata = new PlatformHandlerMetadata({
        handler
      });

      await service.onRequest(handler, $ctx);

      expect(handler).not.toHaveBeenCalled();
    });
    it("should apply headers and status", async () => {
      @Injectable()
      class TestService {
        @Get("/")
        use() {
          return Promise.resolve("hello");
        }
      }

      const {service} = getServiceFixture();
      const handler = vi.fn().mockResolvedValue({
        status: 201,
        statusText: "CREATED",
        headers: {
          test: "test"
        },
        data: "data"
      });

      const $ctx = PlatformTest.createRequestContext();
      $ctx.next = vi.fn();
      $ctx.endpoint = s.store.method(TestService, "use");

      $ctx.handlerMetadata = new PlatformHandlerMetadata({
        handler: TestService.prototype.use
      });

      vi.spyOn(service, "flush").mockResolvedValue();

      await service.onRequest(handler, $ctx);

      expect(handler).toHaveBeenCalled();
      expect($ctx.response.statusCode).toEqual(201);
      expect($ctx.response.getHeaders()).toEqual({
        test: "test",
        "x-request-id": "id"
      });
    });
  });

  describe("synchronous and asynchronous paths", () => {
    // an earlier test mocks flush() on the shared PlatformHandler instance
    beforeEach(() => vi.restoreAllMocks());

    class PathsCtrl {
      @Get("/")
      get() {}
    }

    function createEndpointContext() {
      const $ctx = PlatformTest.createRequestContext();
      $ctx.endpoint = s.store.method(PathsCtrl, "get");
      $ctx.handlerMetadata = new PlatformHandlerMetadata({
        handler: PathsCtrl.prototype.get,
        type: PlatformHandlerType.ENDPOINT
      });

      return $ctx;
    }

    it("should set the data and the headers before onRequest() returns for a sync handler", () => {
      const {service} = getServiceFixture();
      const $ctx = createEndpointContext();

      const result = service.onRequest(() => ({status: 201, statusText: "CREATED", headers: {test: "test"}, data: "data"}), $ctx);

      expect(result).toBeUndefined();
      expect($ctx.data).toEqual("data");
      expect($ctx.response.statusCode).toEqual(201);
      expect($ctx.response.getHeaders()).toEqual({test: "test", "x-request-id": "id"});
    });

    it("should set the data once the promise of an async handler settles", async () => {
      const {service} = getServiceFixture();
      const $ctx = createEndpointContext();

      const result = service.onRequest(() => Promise.resolve("data"), $ctx);

      expect(result).toBeInstanceOf(Promise);
      expect($ctx.data).toBeUndefined();

      await result;

      expect($ctx.data).toEqual("data");
    });

    it("should throw the error of a sync handler synchronously", () => {
      const {service} = getServiceFixture();
      const $ctx = createEndpointContext();
      const error = new Error("sync");

      expect(() =>
        service.onRequest(() => {
          throw error;
        }, $ctx)
      ).toThrow(error);
    });

    it("should reject with the error of an async handler", async () => {
      const {service} = getServiceFixture();
      const $ctx = createEndpointContext();
      const error = new Error("async");

      await expect(service.onRequest(() => Promise.reject(error), $ctx)).rejects.toBe(error);
    });

    it("should send the body in the same tick when the response filter is sync", () => {
      const {service} = getServiceFixture();
      const $ctx = createEndpointContext();
      $ctx.data = {id: "1"};
      vi.spyOn($ctx.response, "body");

      const result = service.flush($ctx);

      expect(result).toBeUndefined();
      expect($ctx.response.body).toHaveBeenCalledWith({id: "1"});
    });

    it("should wait for a response filter returning a promise", async () => {
      const {service} = getServiceFixture();
      const $ctx = createEndpointContext();
      $ctx.data = {id: "1"};
      vi.spyOn($ctx.response, "body");
      vi.spyOn(service["responseFilter"], "resolveBody").mockResolvedValue("filtered");

      const result = service.flush($ctx);

      expect(result).toBeInstanceOf(Promise);
      expect($ctx.response.body).not.toHaveBeenCalled();

      await result;

      expect($ctx.response.body).toHaveBeenCalledWith("filtered");
    });

    it("should send a sync response filter error to the exception filters", () => {
      const {service} = getServiceFixture();
      const $ctx = createEndpointContext();
      const error = new Error("filter");
      vi.spyOn(service["responseFilter"], "resolveBody").mockImplementation(() => {
        throw error;
      });
      vi.spyOn(service["platformExceptions"], "catch").mockReturnValue(undefined as any);

      service.flush($ctx);

      expect(service["platformExceptions"].catch).toHaveBeenCalledWith(error, $ctx);
    });

    it("should send an async response filter error to the exception filters", async () => {
      const {service} = getServiceFixture();
      const $ctx = createEndpointContext();
      const error = new Error("filter");
      vi.spyOn(service["responseFilter"], "resolveBody").mockRejectedValue(error);
      vi.spyOn(service["platformExceptions"], "catch").mockReturnValue(undefined as any);

      await service.flush($ctx);

      expect(service["platformExceptions"].catch).toHaveBeenCalledWith(error, $ctx);
    });
  });
});
