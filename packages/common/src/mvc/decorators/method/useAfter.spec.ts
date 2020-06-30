import {Store, UnsupportedDecoratorType} from "@tsed/core";
import {expect} from "chai";
import {EndpointMetadata} from "../../models/EndpointMetadata";
import {UseAfter} from "./useAfter";

class CustomMiddleware {
  use() {
  }
}

describe("UseAfter()", () => {
  describe("when the decorator is use on a class", () => {


    it("should add the middleware on the use stack", () => {
      // WHEN
      @UseAfter(CustomMiddleware)
      class Test {
        test() {
        }
      }

      // THEN
      const store = Store.from(Test).get("middlewares");

      expect(store).to.deep.eq({useAfter: [CustomMiddleware]});
    });
  });
  describe("when the decorator is use on a method", () => {
    it("should add the middleware on the use stack", () => {
      // WHEN
      class Test {
        @UseAfter(CustomMiddleware)
        test() {
        }
      }

      // THEN
      const endpoint = EndpointMetadata.get(Test, "test");
      expect(endpoint.afterMiddlewares).to.deep.equal([CustomMiddleware]);
    });
  });
  describe("when the decorator is use in another way", () => {
    class Test {
      test() {
      }
    }

    it("should add the middleware on the use stack", () => {
      // WHEN
      let actualError;
      try {
        UseAfter(CustomMiddleware)(Test, "property");
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError).to.be.instanceOf(UnsupportedDecoratorType);
      expect(actualError.message).to.eq("UseAfter cannot be used as property.static decorator on Test.property");
    });
  });
});
