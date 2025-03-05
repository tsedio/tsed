import {Store} from "@tsed/core";

import {PLATFORM_MULTER_OPTIONS} from "../constants/constants.js";
import {MulterOptions} from "./multerOptions.js";

describe("@MulterOptions()", () => {
  it("should store metadata", () => {
    class Test {
      @MulterOptions({dest: "/"})
      test() {}
    }

    const store = Store.fromMethod(Test.prototype, "test");

    expect(store.get(PLATFORM_MULTER_OPTIONS)).toEqual({
      options: {
        dest: "/"
      }
    });
  });
});
