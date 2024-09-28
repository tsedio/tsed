import {decoratorArgs, prototypeOf, Store, UnsupportedDecoratorType} from "@tsed/core";

import {AuthOptions} from "./authOptions.js";

class Guard {
  use() {}
}

describe("AuthOptions()", () => {
  describe("when the decorator is use on a method", () => {
    class Test {
      test() {}
    }

    it("should add the middleware on the use stack", () => {
      // WHEN
      AuthOptions(Guard, {
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
      })(...decoratorArgs(prototypeOf(Test), "test"));

      // THEN
      const store = Store.from(...decoratorArgs(prototypeOf(Test), "test"));
      expect(store.get(Guard)).toEqual({
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
      });
    });
  });
  describe("when the decorator is use on a class", () => {
    class Test {
      test() {}
    }

    it("should add the middleware on the use stack", () => {
      // WHEN
      AuthOptions(Guard, {
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
      })(Test);

      // THEN
      const store = Store.from(...decoratorArgs(prototypeOf(Test), "test"));
      expect(store.get(Guard)).toEqual({
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
      });

      store.set("responses", {});
    });
  });
  describe("when the decorator is use on a class and method", () => {
    it("should add the middleware on the use stack", () => {
      // WHEN

      @AuthOptions(Guard, {role: "test"})
      class Test {
        @AuthOptions(Guard, {role: "test2"})
        test() {}

        test2() {}
      }

      // THEN
      const storeTest = Store.from(...decoratorArgs(prototypeOf(Test), "test"));
      const storeTest2 = Store.from(...decoratorArgs(prototypeOf(Test), "test2"));
      expect(storeTest.get(Guard)).toEqual({role: "test2"});
      expect(storeTest2.get(Guard)).toEqual({role: "test"});
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
        AuthOptions(Guard)(Test, "property");
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError).toBeInstanceOf(UnsupportedDecoratorType);
      expect(actualError.message).toEqual("AuthOptions cannot be used as property.static decorator on Test.property");
    });
  });
});
