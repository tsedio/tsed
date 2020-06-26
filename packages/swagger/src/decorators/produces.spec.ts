import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {Produces} from "../index";


describe("Produces()", () => {
  describe("when is used as method decorator", () => {
    it("should set the produces", () => {
      class Test {
        @Produces("text/html")
        test() {
        }
      }

      const store = Store.from(Test, "test", descriptorOf(Test, "test"));

      expect(store.get("operation").produces).to.deep.eq(["text/html"]);
    });
  });
});
