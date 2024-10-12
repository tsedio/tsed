import {Store} from "@tsed/core";

import {PlatformMulterMiddleware} from "../../middlewares/PlatformMulterMiddleware.js";
import {MulterOptions} from "./multerOptions.js";

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
