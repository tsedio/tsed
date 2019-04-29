import {descriptorOf, Store} from "@tsed/core";
import {prototypeOf, UnsupportedDecoratorType} from "../../../core/src/utils";
import {Responses} from "../../src";


describe("Responses()", () => {

  describe("when the decorator is used as method decorator", () => {
    class Test {
      test() {
      }
    }

    it("should set the responses", () => {
      // WHEN
      Responses(400, {
        description: "Bad Request"
      })(prototypeOf(Test), "test", descriptorOf(Test, "test"));

      // THEN
      const store = Store.fromMethod(Test, "test");

      store.get("responses").should.deep.eq({
        "400": {
          description: "Bad Request"
        }
      });
    });
  });

  describe("when the decorator is used as class decorator", () => {
    class Test {
      test() {
      }
    }

    it("should set the responses", () => {
      // WHEN
      Responses(400, {
        description: "Bad Request"
      })(Test);

      // THEN
      const store = Store.fromMethod(Test, "test");

      store.get("responses").should.deep.eq({
        "400": {
          description: "Bad Request"
        }
      });
    });
  });

  describe("when the decorator is used as class decorator", () => {
    class Test {
      test() {
      }
    }

    it("should set the responses", () => {
      // WHEN
      let actualError;
      try {
        Responses(400, {
          description: "Bad Request"
        })(prototypeOf(Test), "test");
      } catch (er) {
        actualError = er;
      }


      // THEN
      actualError.should.instanceOf(UnsupportedDecoratorType);
    });
  });
});
