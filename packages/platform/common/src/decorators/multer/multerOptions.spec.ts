import {MulterOptions, PlatformMulterMiddleware} from "@tsed/common";
import {Store} from "@tsed/core";

describe("@MulterOptions()", () => {
  it("should store metadata", () => {
    class Test {
      @MulterOptions({dest: "/"})
      test() {}
    }

    const store = Store.fromMethod(Test.prototype, "test");

    expect(store.get(PlatformMulterMiddleware)).toEqual({
      options: {
        dest: "/"
      }
    });
  });
});
