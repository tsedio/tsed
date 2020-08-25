import {Store} from "@tsed/core";
import {MulterOptions, MultipartFileMiddleware} from "@tsed/multipartfiles";
import {expect} from "chai";

describe("@MulterOptions()", () => {
  describe("when success", () => {
    it("should store metadata", () => {
      class Test {
        @MulterOptions({dest: "/"})
        test() {}
      }

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
        class Test {
          // @ts-ignore
          test(@MulterOptions({dest: "/"}) test: string) {}
        }
      } catch (er) {
        actualError = er;
      }
      expect(actualError.message).to.eq("MulterOptions cannot be used as parameter decorator on Test.test.[0]");
    });
  });
});
