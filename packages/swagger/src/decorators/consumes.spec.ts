import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {Consumes} from "../index";

describe("Consumes()", () => {
  describe("when is used as method decorator", () => {
    before(() => {

    });
    it("should set the produces", () => {
      class Test {
        @Consumes("text/html")
        test() {
        }
      }
      const store = Store.from(Test.prototype, "test", descriptorOf(Test, "test"));

      expect(store.get("operation").consumes).to.deep.eq(["text/html"]);
    });
  });
});
