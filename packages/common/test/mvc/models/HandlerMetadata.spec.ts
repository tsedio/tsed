import {expect} from "chai";
import {Metadata} from "../../../../core/src";
import {IHandlerConstructorOptions, ParamTypes} from "../../../src/mvc";
import {PARAM_METADATA} from "../../../src/mvc/constants";
import {HandlerType} from "../../../src/mvc/interfaces/HandlerType";
import {HandlerMetadata} from "../../../src/mvc/models/HandlerMetadata";

class Test {
  use(req: any, res: any, next: any) {
  }

  test(req: any, res: any, next: any) {
  }
}

class Test2 {
  use(err: any, req: any, res: any, next: any) {
  }
}

describe("HandlerMetadata", () => {
  describe("from function", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      const options = {
        target(req: any, res: any, next: any) {
        }
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);
      // THEN

      handlerMetadata.injectable.should.eq(false);
      handlerMetadata.type.should.eq(HandlerType.FUNCTION);
      handlerMetadata.hasNextFunction.should.eq(true);
      handlerMetadata.hasErrorParam.should.eq(false);
      expect(handlerMetadata.method).to.eq(undefined);
    });
  });

  describe("from function err", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      const options = {
        target(err: any, req: any, res: any, next: any) {
        }
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      handlerMetadata.injectable.should.eq(false);
      handlerMetadata.type.should.eq(HandlerType.FUNCTION);
      handlerMetadata.hasNextFunction.should.eq(true);
      handlerMetadata.hasErrorParam.should.eq(true);
      expect(handlerMetadata.propertyKey).to.eq(undefined);
      expect(handlerMetadata.services).to.deep.eq([
        {
          "index": 0,
          "service": "ERR"
        },
        {
          "index": 1,
          "service": "REQUEST"
        },
        {
          "index": 2,
          "service": "RESPONSE"
        },
        {
          "index": 3,
          "service": "NEXT_FN"
        }
      ]);
    });
  });

  describe("from function without nextFn", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      const options = {
        target(req: any, res: any) {
        }
      };

      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      handlerMetadata.injectable.should.eq(false);
      handlerMetadata.type.should.eq(HandlerType.FUNCTION);
      handlerMetadata.hasNextFunction.should.eq(false);
      handlerMetadata.hasErrorParam.should.eq(false);
      expect(handlerMetadata.propertyKey).to.eq(undefined);
    });
  });

  describe("from endpoint/middleware without injection", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      const options: IHandlerConstructorOptions = {
        target: Test,
        propertyKey: "test",
        type: HandlerType.CONTROLLER
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      expect(handlerMetadata.injectable).to.eq(false, "is injectable");
      expect(handlerMetadata.type).to.eq(HandlerType.CONTROLLER);
      expect(handlerMetadata.hasNextFunction).to.eq(true, "hasn't a next function");
      expect(handlerMetadata.hasErrorParam).to.eq(false, "has an error param");
      expect(handlerMetadata.propertyKey).to.eq("test");
    });
  });

  describe("from endpoint/middleware with injection", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      Metadata.set(PARAM_METADATA, [{service: ParamTypes.NEXT_FN}], Test, "test");

      const options = {
        target: Test,
        propertyKey: "test",
        type: HandlerType.CONTROLLER
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      handlerMetadata.injectable.should.eq(true);
      handlerMetadata.type.should.eq(HandlerType.CONTROLLER);
      handlerMetadata.hasNextFunction.should.eq(true);
      handlerMetadata.hasErrorParam.should.eq(false);
      handlerMetadata.propertyKey.should.eq("test");

      Metadata.set(PARAM_METADATA, undefined, Test, "test");
    });
  });

  describe("from middleware without injection and error", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      const options = {
        target: Test2,
        propertyKey: "use",
        type: HandlerType.MIDDLEWARE
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      handlerMetadata.injectable.should.eq(false);
      handlerMetadata.type.should.eq(HandlerType.MIDDLEWARE);
      handlerMetadata.hasNextFunction.should.eq(true);
      handlerMetadata.hasErrorParam.should.eq(true);
      expect(handlerMetadata.propertyKey).to.eq("use");
    });
  });

  describe("from middleware with injection and error", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      Metadata.set(PARAM_METADATA, [{service: ParamTypes.NEXT_FN}, {service: ParamTypes.ERR}], Test2, "use");
      const options = {
        target: Test2,
        propertyKey: "use",
        type: HandlerType.MIDDLEWARE
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      handlerMetadata.injectable.should.eq(true);
      handlerMetadata.type.should.eq(HandlerType.MIDDLEWARE);
      handlerMetadata.hasNextFunction.should.eq(true);
      handlerMetadata.hasErrorParam.should.eq(true);
      expect(handlerMetadata.propertyKey).to.eq("use");

      Metadata.set(PARAM_METADATA, undefined, Test2, "use");
    });
  });
});
