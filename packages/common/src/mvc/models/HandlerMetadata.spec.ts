import {Store} from "@tsed/core";
import {expect} from "chai";
import {IHandlerConstructorOptions, ParamMetadata, ParamTypes} from "../../../src/mvc";
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
        target(err: any, req: any, res: any, next: any) {
        }
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
        }),
        new ParamMetadata({
          index: 1,
          paramType: ParamTypes.REQUEST
        }),
        new ParamMetadata({
          index: 2,
          paramType: ParamTypes.RESPONSE
        }),
        new ParamMetadata({
          index: 3,
          paramType: ParamTypes.NEXT_FN
        })
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
      Store.fromMethod(Test, "test").set("params", [{paramType: ParamTypes.NEXT_FN}]);

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

      Store.fromMethod(Test, "test").delete("params");
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
      expect(handlerMetadata.injectable).to.eq(false);
      expect(handlerMetadata.type).to.eq(HandlerType.MIDDLEWARE);
      expect(handlerMetadata.hasNextFunction).to.eq(true);
      expect(handlerMetadata.hasErrorParam).to.eq(true);
      expect(handlerMetadata.propertyKey).to.eq("use");
    });
  });

  describe("from middleware with injection and error", () => {
    it("should create a new handlerMetadata with right metadata", () => {
      // GIVEN
      Store.fromMethod(Test2, "use").set("params", [{paramType: ParamTypes.NEXT_FN}, {paramType: ParamTypes.ERR}]);
      const options = {
        target: Test2,
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

      Store.fromMethod(Test, "use").delete("params");
    });
  });
});
