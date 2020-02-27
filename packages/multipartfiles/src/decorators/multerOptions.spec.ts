import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {MulterOptions} from "../../src";
import {MultipartFileMiddleware} from "../../src/middlewares/MultipartFileMiddleware";

class Test {
  test() {}
}

describe("@MulterOptions()", () => {
  describe("when success", () => {
    before(() => {
      MulterOptions({dest: "/"})(Test.prototype, "test", descriptorOf(Test.prototype, "test"));
      this.store = Store.fromMethod(Test.prototype, "test");
    });

    it("should store metadata", () => {
      expect(this.store.get(MultipartFileMiddleware)).to.deep.equal({
        options: {
          dest: "/"
        }
      });
    });
  });

  describe("when error", () => {
    before(() => {
      try {
        MulterOptions({dest: "/"})(Test, "test", {});
      } catch (er) {
        this.error = er;
      }
    });

    it("should store metadata", () => {
      expect(this.error.message).to.eq("MulterOptions is only supported on method");
    });
  });
});
