import {Err, Next, Req} from "@tsed/common";
import {Controller, InjectorService} from "@tsed/di";
import {Middleware} from "@tsed/platform-middlewares";
import {Get, JsonMethodStore} from "@tsed/schema";
import {useContextHandler} from "../utils/useContextHandler";
import {PlatformHandlerMetadata} from "./PlatformHandlerMetadata";
import {PlatformHandlerType} from "./PlatformHandlerType";

describe("PlatformHandlerMetadata", () => {
  describe("from()", () => {
    it("should return PlatformMetadata", () => {
      const meta = new PlatformHandlerMetadata({
        type: PlatformHandlerType.CUSTOM,
        handler: () => {}
      });
      const result = PlatformHandlerMetadata.from({} as any, meta);
      expect(result).toEqual(meta);
    });
  });
  describe("from useContextHandler", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      const handler = useContextHandler((ctx: any) => {});

      // WHEN
      const handlerMetadata = new PlatformHandlerMetadata({
        handler
      });

      // THEN
      expect(handlerMetadata.type).toEqual(PlatformHandlerType.CTX_FN);
      expect(handlerMetadata.hasNextFunction).toEqual(false);
      expect(handlerMetadata.hasErrorParam).toEqual(false);
      expect(handlerMetadata.toString()).toEqual("");
    });
  });
  describe("from function", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      const options = {
        handler(req: any, res: any, next: any) {}
      };
      // WHEN
      const handlerMetadata = new PlatformHandlerMetadata(options);

      // THEN
      expect(handlerMetadata.type).toEqual(PlatformHandlerType.RAW_FN);
      expect(handlerMetadata.hasNextFunction).toEqual(true);
      expect(handlerMetadata.hasErrorParam).toEqual(false);
      expect(handlerMetadata.toString()).toEqual("handler");
    });
  });
  describe("from function err", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      const options = {
        handler(err: any, req: any, res: any, next: any) {}
      };
      // WHEN
      const handlerMetadata = new PlatformHandlerMetadata(options);

      // THEN
      expect(handlerMetadata.type).toEqual(PlatformHandlerType.RAW_ERR_FN);
      expect(handlerMetadata.hasNextFunction).toEqual(true);
      expect(handlerMetadata.hasErrorParam).toEqual(true);
      expect(handlerMetadata.propertyKey).toBeUndefined();
      expect(handlerMetadata.toString()).toEqual("handler");
    });
  });
  describe("from function without nextFn", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      const options = {
        handler(req: any, res: any) {}
      };

      // WHEN
      const handlerMetadata = new PlatformHandlerMetadata(options);

      // THEN
      expect(handlerMetadata.type).toEqual(PlatformHandlerType.RAW_FN);
      expect(handlerMetadata.hasNextFunction).toEqual(false);
      expect(handlerMetadata.hasErrorParam).toEqual(false);
      expect(handlerMetadata.propertyKey).toBeUndefined();
      expect(handlerMetadata.toString()).toEqual("handler");
    });
  });
  describe("from endpoint/middleware with injection", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      @Controller("/")
      class Test {
        @Get("/")
        test(@Req() req: Req, @Next() next: Next) {}
      }

      const injector = new InjectorService();
      injector.addProvider(Test);

      const options = {
        provider: injector.getProvider(Test),
        propertyKey: "test",
        type: PlatformHandlerType.ENDPOINT
      };
      // WHEN
      const handlerMetadata = new PlatformHandlerMetadata(options);

      // THEN
      expect(handlerMetadata.type).toEqual(PlatformHandlerType.ENDPOINT);
      expect(handlerMetadata.hasNextFunction).toEqual(true);
      expect(handlerMetadata.hasErrorParam).toEqual(false);
      expect(handlerMetadata.propertyKey).toEqual("test");
      expect(handlerMetadata.scope).toEqual("singleton");
      expect(handlerMetadata.toString()).toEqual("Test.test");
      expect(handlerMetadata.store).toBeInstanceOf(JsonMethodStore);
      expect(handlerMetadata.isFinal()).toEqual(false);

      expect(handlerMetadata.getParams()[0].paramType).toEqual("REQUEST");
      expect(handlerMetadata.getParams()[1].paramType).toEqual("NEXT_FN");
    });
  });

  describe("from middleware with injection and error", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // WHEN
      @Middleware()
      class Test {
        use(@Err() error: any, @Next() next: Next) {}
      }

      const injector = new InjectorService();
      injector.addProvider(Test);

      const options = {
        provider: injector.getProvider(Test),
        propertyKey: "use",
        type: PlatformHandlerType.MIDDLEWARE
      };
      // WHEN
      const handlerMetadata = new PlatformHandlerMetadata(options);

      // THEN
      expect(handlerMetadata.type).toEqual(PlatformHandlerType.ERR_MIDDLEWARE);
      expect(handlerMetadata.hasNextFunction).toEqual(true);
      expect(handlerMetadata.hasErrorParam).toEqual(true);
      expect(handlerMetadata.propertyKey).toEqual("use");
      expect(handlerMetadata.toString()).toEqual("Test.use");
    });
  });
});
