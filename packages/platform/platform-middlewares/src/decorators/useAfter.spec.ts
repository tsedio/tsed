import {Store, UnsupportedDecoratorType} from "@tsed/core";
import {EndpointMetadata} from "@tsed/schema";

import {UseAfter} from "./useAfter.js";

class CustomMiddleware {
  use() {}
}

class CustomMiddleware2 {
  use() {}
}

describe("UseAfter()", () => {
  describe("when the decorator is use on a class", () => {
    it("should add the middleware on the use stack", () => {
      // WHEN
      @UseAfter(CustomMiddleware)
      @UseAfter(CustomMiddleware2)
      class Test {
        test() {}
      }

      // THEN
      const store = Store.from(Test).get("middlewares");

      expect(store).toEqual({useAfter: [CustomMiddleware, CustomMiddleware2]});
    });
  });
  describe("when the decorator is use on a method", () => {
    it("should add the middleware on the use stack", () => {
      // WHEN
      class Test {
        @UseAfter(CustomMiddleware)
        @UseAfter(CustomMiddleware2)
        test() {}
      }

      // THEN
      const endpoint = EndpointMetadata.get(Test, "test");
      expect(endpoint.afterMiddlewares).toEqual([CustomMiddleware, CustomMiddleware2]);
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
        UseAfter(CustomMiddleware)(Test, "property");
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError).toBeInstanceOf(UnsupportedDecoratorType);
      expect(actualError.message).toEqual("UseAfter cannot be used as property.static decorator on Test.property");
    });
  });
});
