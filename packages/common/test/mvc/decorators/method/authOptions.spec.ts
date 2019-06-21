import {decoratorArgs} from "@tsed/core";
import {Store} from "../../../../../core/src";
import {prototypeOf, UnsupportedDecoratorType} from "../../../../../core/src/utils";
import {AuthOptions} from "../../../../src/mvc";

class Guard {
  use() {
  }
}

describe("AuthOptions()", () => {
  describe("when the decorator is use on a method", () => {
    class Test {
      test() {
      }
    }

    it("should add the middleware on the use stack", () => {
      // WHEN
      AuthOptions(Guard, {
        security: [
          {
            "auth": ["email"]
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

      store.get("operation").should.deep.eq({
        security: [
          {
            "auth": ["email"]
          }
        ]
      });
      store.get("responses").should.deep.eq({
        "200": {
          description: "Success"
        }
      });
      store.set("operation", {});
      store.set("responses", {});
    });
  });
  describe("when the decorator is use on a class", () => {
    class Test {
      test() {
      }
    }

    it("should add the middleware on the use stack", () => {
      // WHEN
      AuthOptions(Guard, {
        security: [
          {
            "auth": ["email"]
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

      store.get("operation").should.deep.eq({
        security: [
          {
            "auth": ["email"]
          }
        ]
      });
      store.get("responses").should.deep.eq({
        "200": {
          description: "Success"
        }
      });

      store.set("operation", {});
      store.set("responses", {});
    });
  });
  describe("when the decorator is use on a class and method", () => {
    it("should add the middleware on the use stack", () => {
      // WHEN

      @AuthOptions(Guard, {role: "test"})
      class Test {
        @AuthOptions(Guard, {role: "test2"})
        test() {
        }

        test2() {
        }
      }

      // THEN
      const storeTest = Store.from(...decoratorArgs(prototypeOf(Test), "test"));
      const storeTest2 = Store.from(...decoratorArgs(prototypeOf(Test), "test2"));
      storeTest.get(Guard).should.deep.eq({role: "test2"});
      storeTest2.get(Guard).should.deep.eq({role: "test"});
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
        AuthOptions(Guard)(Test, "property");
      } catch (er) {
        actualError = er;
      }

      // THEN
      actualError.should.instanceOf(UnsupportedDecoratorType);
      actualError.message.should.eq("AuthOptions cannot used as property.static decorator on Test.property");
    });
  });
});
