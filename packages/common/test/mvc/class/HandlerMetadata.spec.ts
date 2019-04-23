import {expect} from "chai";
import * as Sinon from "sinon";
import {Metadata} from "../../../../core/src";
import {ParamRegistry, ProviderRegistry} from "../../../src";
import {EXPRESS_ERR, EXPRESS_NEXT_FN, PARAM_METADATA} from "../../../src/filters/constants";
import {HandlerMetadata} from "../../../src/mvc/class/HandlerMetadata";
import {HandlerType} from "../../../src/mvc/interfaces/HandlerType";

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
      expect(handlerMetadata.methodClassName).to.eq(undefined);
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
      expect(handlerMetadata.methodClassName).to.eq(undefined);
    });
  });

  describe("from endpoint/middleware without injection", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      const options = {
        target: Test,
        method: "test",
        type: HandlerType.CONTROLLER
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      handlerMetadata.injectable.should.eq(false);
      handlerMetadata.type.should.eq(HandlerType.CONTROLLER);
      handlerMetadata.hasNextFunction.should.eq(true);
      handlerMetadata.hasErrorParam.should.eq(false);
      handlerMetadata.methodClassName.should.eq("test");
    });
  });

  describe("from endpoint/middleware without injection", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      Metadata.set(PARAM_METADATA, [{service: EXPRESS_NEXT_FN}], Test, "test");

      const options = {
        target: Test,
        method: "test",
        type: HandlerType.CONTROLLER
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      handlerMetadata.injectable.should.eq(true);
      handlerMetadata.type.should.eq(HandlerType.CONTROLLER);
      handlerMetadata.hasNextFunction.should.eq(true);
      handlerMetadata.hasErrorParam.should.eq(false);
      handlerMetadata.methodClassName.should.eq("test");

      Metadata.set(PARAM_METADATA, undefined, Test, "test");
    });
  });

  describe("from middleware without injection and error", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      const options = {
        target: Test2,
        method: "use",
        type: HandlerType.MIDDLEWARE
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      handlerMetadata.injectable.should.eq(false);
      handlerMetadata.type.should.eq(HandlerType.MIDDLEWARE);
      handlerMetadata.hasNextFunction.should.eq(true);
      handlerMetadata.hasErrorParam.should.eq(true);
      expect(handlerMetadata.methodClassName).to.eq("use");
    });
  });

  describe("from middleware with injection and error", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      Metadata.set(PARAM_METADATA, [{service: EXPRESS_NEXT_FN}, {service: EXPRESS_ERR}], Test2, "use");
      const options = {
        target: Test2,
        method: "use",
        type: HandlerType.MIDDLEWARE
      };
      // WHEN
      const handlerMetadata = new HandlerMetadata(options);

      // THEN
      handlerMetadata.injectable.should.eq(true);
      handlerMetadata.type.should.eq(HandlerType.MIDDLEWARE);
      handlerMetadata.hasNextFunction.should.eq(true);
      handlerMetadata.hasErrorParam.should.eq(true);
      expect(handlerMetadata.methodClassName).to.eq("use");

      Metadata.set(PARAM_METADATA, undefined, Test2, "use");
    });
  });
});
