import {prototypeOf, UnsupportedDecoratorType} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {EndpointMetadata, UseBeforeEach} from "../../../../src/mvc";

class CustomMiddleware {
  use() {}
}

describe("UseBeforeEach()", () => {
  describe("when the decorator is use on a class", () => {
    it("should add the middleware on the use stack", () => {
      @UseBeforeEach(CustomMiddleware)
      class Test {
        test() {}
      }

      const endpoint = EndpointMetadata.get(Test, "test");
      // THEN
      expect(endpoint.beforeMiddlewares).to.deep.eq([CustomMiddleware]);
    });
  });
  describe("when the decorator is use on a method", () => {
    it("should add the middleware on the use stack", () => {
      // WHEN
      class Test {
        @UseBeforeEach(CustomMiddleware)
        test() {}
      }

      // THEN
      const endpoint = EndpointMetadata.get(Test, "test");
      expect(endpoint.beforeMiddlewares).to.deep.eq([CustomMiddleware]);
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
        UseBeforeEach(CustomMiddleware)(Test, "property");
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError).to.be.instanceOf(UnsupportedDecoratorType);
      expect(actualError.message).to.eq("UseBeforeEach cannot be used as property.static decorator on Test.property");
    });
  });
});
