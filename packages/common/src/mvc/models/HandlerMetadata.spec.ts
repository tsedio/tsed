import {Controller, Err, Get, Middleware, Next, ParamMetadata, ParamTypes, Req} from "@tsed/common";
import {expect} from "chai";
import {HandlerType} from "../../../src/mvc/interfaces/HandlerType";
import {HandlerMetadata} from "../../../src/mvc/models/HandlerMetadata";

describe("HandlerMetadata", () => {
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
      expect(handlerMetadata.type).to.eq(HandlerType.FUNCTION);
      expect(handlerMetadata.hasNextFunction).to.eq(true);
      expect(handlerMetadata.hasErrorParam).to.eq(false);
      expect(handlerMetadata.method).to.eq(undefined);
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
      expect(handlerMetadata.type).to.eq(HandlerType.FUNCTION);
      expect(handlerMetadata.hasNextFunction).to.eq(true);
      expect(handlerMetadata.hasErrorParam).to.eq(true);
      expect(handlerMetadata.propertyKey).to.eq(undefined);

      expect(handlerMetadata.parameters).to.deep.eq([
        new ParamMetadata({
          index: 0,
          paramType: ParamTypes.ERR
        } as any),
        new ParamMetadata({
          index: 1,
          paramType: ParamTypes.REQUEST
        } as any),
        new ParamMetadata({
          index: 2,
          paramType: ParamTypes.RESPONSE
        } as any),
        new ParamMetadata({
          index: 3,
          paramType: ParamTypes.NEXT_FN
        } as any)
      ]);
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
      expect(handlerMetadata.type).to.eq(HandlerType.FUNCTION);
      expect(handlerMetadata.hasNextFunction).to.eq(false);
      expect(handlerMetadata.hasErrorParam).to.eq(false);
      expect(handlerMetadata.propertyKey).to.eq(undefined);
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
        type: HandlerType.CONTROLLER
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      expect(handlerMetadata.injectable).to.eq(false);
      expect(handlerMetadata.type).to.eq(HandlerType.CONTROLLER);
      expect(handlerMetadata.hasNextFunction).to.eq(true);
      expect(handlerMetadata.hasErrorParam).to.eq(false);
      expect(handlerMetadata.propertyKey).to.eq("test");
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
        type: HandlerType.CONTROLLER
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      expect(handlerMetadata.injectable).to.eq(true);
      expect(handlerMetadata.type).to.eq(HandlerType.CONTROLLER);
      expect(handlerMetadata.hasNextFunction).to.eq(true);
      expect(handlerMetadata.hasErrorParam).to.eq(false);
      expect(handlerMetadata.propertyKey).to.eq("test");

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
      expect(handlerMetadata.type).to.eq(HandlerType.MIDDLEWARE);
      expect(handlerMetadata.hasNextFunction).to.eq(true);
      expect(handlerMetadata.hasErrorParam).to.eq(true);
      expect(handlerMetadata.propertyKey).to.eq("use");
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
      expect(handlerMetadata.type).to.eq(HandlerType.MIDDLEWARE);
      expect(handlerMetadata.hasNextFunction).to.eq(true);
      expect(handlerMetadata.hasErrorParam).to.eq(true);
      expect(handlerMetadata.propertyKey).to.eq("use");
    });
  });
});
