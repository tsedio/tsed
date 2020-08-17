import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {MulterOptions} from "../../src";
import {MultipartFileMiddleware} from "../../src/middlewares/MultipartFileMiddleware";

class Test {
  test() {}
}

describe("@MulterOptions()", () => {
  describe("when success", () => {
    it("should store metadata", () => {
      MulterOptions({dest: "/"})(Test.prototype, "test", descriptorOf(Test.prototype, "test"));
      const store = Store.fromMethod(Test.prototype, "test");
      expect(store.get(MultipartFileMiddleware)).to.deep.equal({
        options: {
          dest: "/"
        }
      });
    });
  });

  describe("when error", () => {
    it("should store metadata", () => {
      let actualError: any;
      try {
        MulterOptions({dest: "/"})(Test, "test", {});
      } catch (er) {
        actualError = er;
      }
      expect(actualError.message).to.eq("MulterOptions cannot be used as class decorator on Test.test");
    });
  });
});
