import {decoratorArgs, prototypeOf, Store, UnsupportedDecoratorType} from "@tsed/core";
import {EndpointMetadata} from "@tsed/schema";

import {UseAuth} from "./useAuth.js";

class Guard {
  use() {}
}

describe("UseAuth()", () => {
  describe("when the decorator is use on a method", () => {
    it("should add the middleware on the use stack", () => {
      // WHEN
      @UseAuth(Guard, {
        security: [
          {
            auth: ["email"]
          }
        ],
        responses: {
          "200": {
            description: "Success"
          }
        }
      })
      class Test {
        test() {}
      }

      // THEN
      const args = decoratorArgs(prototypeOf(Test), "test");
      const store = Store.from(...args);
      // @ts-ignore
      const endpoint = EndpointMetadata.get(...args);

      expect(endpoint.beforeMiddlewares).toEqual([Guard]);
      expect(store.get(Guard)).toEqual({
        responses: {
          "200": {
            description: "Success"
          }
        },
        security: [
          {
            auth: ["email"]
          }
        ]
      });
    });
  });
  describe("when the decorator is use on a class", () => {
    it("should add the middleware on the use stack", () => {
      // WHEN
      @UseAuth(Guard, {
        security: [
          {
            auth: ["email"]
          }
        ],
        responses: {
          "200": {
            description: "Success"
          }
        }
      })
      class Test {
        test() {}
      }

      // THEN
      const args = decoratorArgs(prototypeOf(Test), "test");
      const store = Store.from(...args);
      // @ts-ignore
      const endpoint = EndpointMetadata.get(...args);

      expect(endpoint.beforeMiddlewares).toEqual([Guard]);

      expect(store.get(Guard)).toEqual({
        responses: {
          "200": {
            description: "Success"
          }
        },
        security: [
          {
            auth: ["email"]
          }
        ]
      });
    });
  });
  describe("when the decorator is use on a class and method", () => {
    it("should add the middleware on the use stack", () => {
      // WHEN

      @UseAuth(Guard, {defaultRole: "test"})
      class Test {
        @UseAuth(Guard, {role: "test2"})
        test() {}

        test2() {}
      }

      // THEN
      const storeTest = Store.from(...decoratorArgs(prototypeOf(Test), "test"));
      const storeTest2 = Store.from(...decoratorArgs(prototypeOf(Test), "test2"));
      // @ts-ignore
      const endpoint = EndpointMetadata.get(Test, "test");
      expect(endpoint.beforeMiddlewares).toEqual([Guard]);

      const endpoint2 = EndpointMetadata.get(Test, "test2");
      expect(endpoint2.beforeMiddlewares).toEqual([Guard]);

      expect(storeTest.get(Guard)).toEqual({role: "test2", defaultRole: "test"});
      expect(storeTest2.get(Guard)).toEqual({defaultRole: "test"});
    });
  });
  describe("when the decorator is use in another way", () => {
    it("should add the middleware on the use stack", () => {
      // WHEN
      let actualError;
      try {
        class Test {}

        UseAuth(Guard)(Test, "property");
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError).toBeInstanceOf(UnsupportedDecoratorType);
      expect(actualError.message).toEqual("UseAuth cannot be used as property.static decorator on Test.property");
    });
  });
});
