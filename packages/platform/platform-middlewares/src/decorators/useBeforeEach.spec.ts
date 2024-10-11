import {UnsupportedDecoratorType} from "@tsed/core";
import {EndpointMetadata} from "@tsed/schema";

import {UseBeforeEach} from "./useBeforeEach.js";

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
      expect(endpoint.beforeMiddlewares).toEqual([CustomMiddleware]);
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
      expect(endpoint.beforeMiddlewares).toEqual([CustomMiddleware]);
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
      expect(actualError).toBeInstanceOf(UnsupportedDecoratorType);
      expect(actualError.message).toEqual("UseBeforeEach cannot be used as property.static decorator on Test.property");
    });
  });
});
