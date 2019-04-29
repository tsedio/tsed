import {descriptorOf, Store} from "@tsed/core";
import {prototypeOf, UnsupportedDecoratorType} from "../../../core/src/utils";
import {Operation} from "../../src";

describe("Operation()", () => {
  describe("when the decorator is used as method decorator", () => {
    class Test {
      test() {
      }
    }

    it("should set the operation", () => {
      // WHEN
      Operation({
        security: [
          {"auth": ["scope"]}
        ]
      })(prototypeOf(Test), "test", descriptorOf(Test, "test"));

      // THEN
      const store = Store.fromMethod(Test, "test");

      store.get("operation").should.deep.eq({
        security: [
          {"auth": ["scope"]}
        ]
      });
    });
  });

  describe("when the decorator is used as class decorator", () => {
    class Test {
      test() {
      }
    }

    it("should set the operation", () => {
      // WHEN
      Operation({
        security: [
          {"auth": ["scope"]}
        ]
      })(Test);

      // THEN
      const store = Store.fromMethod(Test, "test");

      store.get("operation").should.deep.eq({
        security: [
          {"auth": ["scope"]}
        ]
      });
    });
  });

  describe("when the decorator is used as class decorator", () => {
    class Test {
      test() {
      }
    }

    it("should set the operation", () => {
      // WHEN
      let actualError;
      try {
        Operation({
          security: [
            {"auth": ["scope"]}
          ]
        })(prototypeOf(Test), "test");
      } catch (er) {
        actualError = er;
      }


      // THEN
      actualError.should.instanceOf(UnsupportedDecoratorType);
    });
  });
});
