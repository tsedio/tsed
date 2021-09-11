import {Controller, Err, Get, Middleware, Next, ParamMetadata, ParamTypes, Req} from "@tsed/common";
import {expect} from "chai";
import {HandlerType} from "../../../src/mvc/interfaces/HandlerType";
import {HandlerMetadata} from "../../../src/mvc/models/HandlerMetadata";
import {useCtxHandler} from "../../platform/utils/useCtxHandler";

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
      expect(handlerMetadata.injectable).to.eq(false);
      expect(handlerMetadata.type).to.eq(HandlerType.CTX_FN);
      expect(handlerMetadata.hasNextFunction).to.eq(false);
      expect(handlerMetadata.hasErrorParam).to.eq(false);
      expect(handlerMetadata.toString()).to.eq("");
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
      expect(handlerMetadata.injectable).to.eq(false);
      expect(handlerMetadata.type).to.eq(HandlerType.RAW_FN);
      expect(handlerMetadata.hasNextFunction).to.eq(true);
      expect(handlerMetadata.hasErrorParam).to.eq(false);
      expect(handlerMetadata.toString()).to.eq("");
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
      expect(handlerMetadata.injectable).to.eq(false);
      expect(handlerMetadata.type).to.eq(HandlerType.RAW_ERR_FN);
      expect(handlerMetadata.hasNextFunction).to.eq(true);
      expect(handlerMetadata.hasErrorParam).to.eq(true);
      expect(handlerMetadata.propertyKey).to.eq(undefined);
      expect(handlerMetadata.toString()).to.eq("");
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
      expect(handlerMetadata.injectable).to.eq(false);
      expect(handlerMetadata.type).to.eq(HandlerType.RAW_FN);
      expect(handlerMetadata.hasNextFunction).to.eq(false);
      expect(handlerMetadata.hasErrorParam).to.eq(false);
      expect(handlerMetadata.propertyKey).to.eq(undefined);
      expect(handlerMetadata.toString()).to.eq("");
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
      expect(handlerMetadata.injectable).to.eq(false);
      expect(handlerMetadata.type).to.eq(HandlerType.ENDPOINT);
      expect(handlerMetadata.hasNextFunction).to.eq(true);
      expect(handlerMetadata.hasErrorParam).to.eq(false);
      expect(handlerMetadata.propertyKey).to.eq("test");
      expect(handlerMetadata.toString()).to.eq("Test.test");
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
      expect(handlerMetadata.injectable).to.eq(true);
      expect(handlerMetadata.type).to.eq(HandlerType.ENDPOINT);
      expect(handlerMetadata.hasNextFunction).to.eq(true);
      expect(handlerMetadata.hasErrorParam).to.eq(false);
      expect(handlerMetadata.propertyKey).to.eq("test");
      expect(handlerMetadata.toString()).to.eq("Test.test");

      expect(handlerMetadata.getParams()[0].paramType).to.deep.eq("REQUEST");
      expect(handlerMetadata.getParams()[1].paramType).to.deep.eq("NEXT_FN");
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
      expect(handlerMetadata.injectable).to.eq(false);
      expect(handlerMetadata.type).to.eq(HandlerType.RAW_ERR_FN);
      expect(handlerMetadata.hasNextFunction).to.eq(true);
      expect(handlerMetadata.hasErrorParam).to.eq(true);
      expect(handlerMetadata.propertyKey).to.eq("use");
      expect(handlerMetadata.toString()).to.eq("Test.use");
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
      expect(handlerMetadata.injectable).to.eq(true);
      expect(handlerMetadata.type).to.eq(HandlerType.ERR_MIDDLEWARE);
      expect(handlerMetadata.hasNextFunction).to.eq(true);
      expect(handlerMetadata.hasErrorParam).to.eq(true);
      expect(handlerMetadata.propertyKey).to.eq("use");
      expect(handlerMetadata.toString()).to.eq("Test.use");
    });
  });
});
