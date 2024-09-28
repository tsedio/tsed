import {descriptorOf, Store} from "@tsed/core";

import {MONGOOSE_SCHEMA} from "../constants/constants.js";
import {Expires} from "./expires.js";

describe("@Expires()", () => {
  it("should set metadata", () => {
    class Test {
      @Expires("5d")
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      expires: "5d"
    });
  });
});
