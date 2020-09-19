import {Store, UnsupportedDecoratorType} from "@tsed/core";
import {expect} from "chai";
import {EndpointMetadata, UseBefore} from "../../../../src/mvc";

class CustomMiddleware {
  use() {}
}

class CustomMiddleware2 {
  use() {}
}

describe("UseBefore()", () => {
  describe("when the decorator is use on a class", () => {
    it("should add the middleware on the use stack", () => {
      // WHEN
      @UseBefore(CustomMiddleware)
      @UseBefore(CustomMiddleware2)
      class Test {
        test() {}
      }

      // THEN
      const result = Store.from(Test).get("middlewares");

      expect(result).to.deep.eq({useBefore: [CustomMiddleware, CustomMiddleware2]});
    });
  });
  describe("when the decorator is use on a method", () => {
    it("should add the middleware on the use stack", () => {
      // WHEN
      class Test {
        @UseBefore(CustomMiddleware)
        @UseBefore(CustomMiddleware2)
        test() {}
      }

      const endpoint = EndpointMetadata.get(Test, "test");
      // THEN
      expect(endpoint.beforeMiddlewares).to.deep.eq([CustomMiddleware, CustomMiddleware2]);
    });
  });
  describe("when the decorator is use in another way", () => {
    class Test {
      test() {}
    }

    it("should add the middleware on the use stack", () => {
      // WHEN
      let actualError;
      try {
        UseBefore(CustomMiddleware)(Test, "property");
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError).to.be.instanceOf(UnsupportedDecoratorType);
      expect(actualError.message).to.eq("UseBefore cannot be used as property.static decorator on Test.property");
    });
  });
});
