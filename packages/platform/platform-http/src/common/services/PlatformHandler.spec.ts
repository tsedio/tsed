import {Get, s, View} from "@tsed/schema";
import {Injectable, runInContext} from "@tsed/di";
import {PlatformHandlerMetadata, PlatformHandlerType} from "@tsed/platform-router";
import {PlatformHandler} from "./PlatformHandler.js";
import {PlatformTest} from "../../testing/PlatformTest.js";
import {createFetchContext} from "../utils/createContext.js";

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

  describe("flush()", () => {
    it("should finalize a direct Fetch response without an adapter write", async () => {
      const {service} = getServiceFixture();
      vi.restoreAllMocks();
      const $ctx = createFetchContext(new Request("https://tsed.dev/hello"));
      $ctx.data = {hello: "world"};
      vi.spyOn((service as any).responseFilter, "transform").mockResolvedValue($ctx.data);

      expect($ctx.isDone()).toBe(false);
      const response = await service.finalizeResponse($ctx);

      expect(response).toBeInstanceOf(Response);
      expect(await response?.json()).toEqual({hello: "world"});
      expect($ctx.response.isHeadersSent()).toBe(true);
    });

    it("should delegate bridged contexts to the host response writer", async () => {
      const {service} = getServiceFixture();
      vi.restoreAllMocks();
      const $ctx = PlatformTest.createRequestContext();
      $ctx.data = "hello";
      vi.spyOn((service as any).responseFilter, "transform").mockResolvedValue($ctx.data);
      const sendResponse = vi.spyOn((service as any).platformAdapter, "sendResponse").mockResolvedValue();

      await service.flush($ctx);

      expect(sendResponse).toHaveBeenCalledWith($ctx);
      expect($ctx.response.isHeadersSent()).toBe(false);
    });
  });
});
