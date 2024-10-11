import {Store, UnsupportedDecoratorType} from "@tsed/core";
import {EndpointMetadata} from "@tsed/schema";

import {UseBefore} from "./useBefore.js";

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

      expect(result).toEqual({useBefore: [CustomMiddleware, CustomMiddleware2]});
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
      expect(endpoint.beforeMiddlewares).toEqual([CustomMiddleware, CustomMiddleware2]);
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
      expect(actualError).toBeInstanceOf(UnsupportedDecoratorType);
      expect(actualError.message).toEqual("UseBefore cannot be used as property.static decorator on Test.property");
    });
  });
});
