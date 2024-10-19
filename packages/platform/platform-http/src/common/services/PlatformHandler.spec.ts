import {Injectable, runInContext} from "@tsed/di";
import {PlatformHandlerMetadata, PlatformHandlerType} from "@tsed/platform-router";
import {EndpointMetadata, Get, View} from "@tsed/schema";

import {PlatformTest} from "../../testing/PlatformTest.js";
import {PlatformHandler} from "./PlatformHandler.js";

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

      PlatformTest.injector.addProvider(Test);

      const metadata = new PlatformHandlerMetadata({
        provider: PlatformTest.injector.getProvider(Test),
        propertyKey: "get",
        type: PlatformHandlerType.ENDPOINT
      });

      const $ctx = PlatformTest.createRequestContext();
      $ctx.endpoint = EndpointMetadata.get(Test, "get");

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
      const provider = PlatformTest.injector.getProvider(TestService)!;

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
      $ctx.endpoint = EndpointMetadata.get(TestService, "use");

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
});
