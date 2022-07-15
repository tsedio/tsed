import {Controller, Err, Get, HandlerType, Middleware, Next, Req} from "@tsed/common";
import {useCtxHandler} from "../utils/useCtxHandler";
import {HandlerMetadata} from "./HandlerMetadata";

describe("HandlerMetadata", () => {
  describe("from useCtxHandler", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      const handler = useCtxHandler((ctx: any) => {});
      const options = {
        target: handler
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      expect(handlerMetadata.injectable).toEqual(false);
      expect(handlerMetadata.type).toEqual(HandlerType.CTX_FN);
      expect(handlerMetadata.hasNextFunction).toEqual(false);
      expect(handlerMetadata.hasErrorParam).toEqual(false);
      expect(handlerMetadata.toString()).toEqual("");
    });
  });
  describe("from function", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      const options = {
        target(req: any, res: any, next: any) {}
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      expect(handlerMetadata.injectable).toEqual(false);
      expect(handlerMetadata.type).toEqual(HandlerType.RAW_FN);
      expect(handlerMetadata.hasNextFunction).toEqual(true);
      expect(handlerMetadata.hasErrorParam).toEqual(false);
      expect(handlerMetadata.toString()).toEqual("");
    });
  });
  describe("from function err", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      const options = {
        target(err: any, req: any, res: any, next: any) {}
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      expect(handlerMetadata.injectable).toEqual(false);
      expect(handlerMetadata.type).toEqual(HandlerType.RAW_ERR_FN);
      expect(handlerMetadata.hasNextFunction).toEqual(true);
      expect(handlerMetadata.hasErrorParam).toEqual(true);
      expect(handlerMetadata.propertyKey).toBeUndefined();
      expect(handlerMetadata.toString()).toEqual("");
    });
  });
  describe("from function without nextFn", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      const options = {
        target(req: any, res: any) {}
      };

      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      expect(handlerMetadata.injectable).toEqual(false);
      expect(handlerMetadata.type).toEqual(HandlerType.RAW_FN);
      expect(handlerMetadata.hasNextFunction).toEqual(false);
      expect(handlerMetadata.hasErrorParam).toEqual(false);
      expect(handlerMetadata.propertyKey).toBeUndefined();
      expect(handlerMetadata.toString()).toEqual("");
    });
  });
  describe("from endpoint/middleware without injection", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      @Controller("/")
      class Test {
        @Get("/")
        test(req: any, res: any, next: any) {}
      }

      const options = {
        target: Test,
        propertyKey: "test",
        type: HandlerType.ENDPOINT
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      expect(handlerMetadata.injectable).toEqual(false);
      expect(handlerMetadata.type).toEqual(HandlerType.ENDPOINT);
      expect(handlerMetadata.hasNextFunction).toEqual(true);
      expect(handlerMetadata.hasErrorParam).toEqual(false);
      expect(handlerMetadata.propertyKey).toEqual("test");
      expect(handlerMetadata.toString()).toEqual("Test.test");
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

      const options = {
        target: Test,
        propertyKey: "test",
        type: HandlerType.ENDPOINT
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      expect(handlerMetadata.injectable).toEqual(true);
      expect(handlerMetadata.type).toEqual(HandlerType.ENDPOINT);
      expect(handlerMetadata.hasNextFunction).toEqual(true);
      expect(handlerMetadata.hasErrorParam).toEqual(false);
      expect(handlerMetadata.propertyKey).toEqual("test");
      expect(handlerMetadata.toString()).toEqual("Test.test");

      expect(handlerMetadata.getParams()[0].paramType).toEqual("REQUEST");
      expect(handlerMetadata.getParams()[1].paramType).toEqual("NEXT_FN");
    });
  });
  describe("from middleware without injection and error", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      @Middleware()
      class Test {
        use(error: any, req: any, res: any, next: any) {}
      }

      const options = {
        target: Test,
        propertyKey: "use",
        type: HandlerType.MIDDLEWARE
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      expect(handlerMetadata.injectable).toEqual(false);
      expect(handlerMetadata.type).toEqual(HandlerType.RAW_ERR_FN);
      expect(handlerMetadata.hasNextFunction).toEqual(true);
      expect(handlerMetadata.hasErrorParam).toEqual(true);
      expect(handlerMetadata.propertyKey).toEqual("use");
      expect(handlerMetadata.toString()).toEqual("Test.use");
    });
  });
  describe("from middleware with injection and error", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // WHEN
      @Middleware()
      class Test {
        use(@Err() error: any, @Next() next: Next) {}
      }

      const options = {
        target: Test,
        propertyKey: "use",
        type: HandlerType.MIDDLEWARE
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      expect(handlerMetadata.injectable).toEqual(true);
      expect(handlerMetadata.type).toEqual(HandlerType.ERR_MIDDLEWARE);
      expect(handlerMetadata.hasNextFunction).toEqual(true);
      expect(handlerMetadata.hasErrorParam).toEqual(true);
      expect(handlerMetadata.propertyKey).toEqual("use");
      expect(handlerMetadata.toString()).toEqual("Test.use");
    });
  });
});
