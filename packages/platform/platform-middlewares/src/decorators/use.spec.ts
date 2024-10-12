import {Store} from "@tsed/core";
import {EndpointMetadata} from "@tsed/schema";

import {Use} from "./use.js";

describe("Use()", () => {
  describe("when the decorator is use on a method", () => {
    it("should add the middleware on the use stack", () => {
      const middleware = () => {};

      class Test {
        @Use(middleware)
        test() {}
      }

      const endpoint = EndpointMetadata.get(Test, "test");
      expect(endpoint.middlewares).toEqual([middleware]);
    });
  });

  describe("when the decorator is use on a class", () => {
    it("should add the middleware on the use stack", () => {
      const middleware = () => {};

      @Use(middleware)
      class Test {
        test() {}
      }

      const store = Store.from(Test).get("middlewares");
      expect(store.use[0]).toBeInstanceOf(Function);
      expect(store.use[0]).toEqual(middleware);
    });
  });

  describe("when the decorator is use on a property", () => {
    it("should throw error", () => {
      const middleware = () => {};

      let actualError: any;
      try {
        class Test {
          @Use(middleware)
          test: string;
        }
      } catch (er) {
        actualError = er;
      }

      expect(actualError.message).toEqual("Use cannot be used as property decorator on Test.test");
    });
  });
});
