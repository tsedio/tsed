import {descriptorOf, Store} from "@tsed/core";

import {Select} from "../../src/index.js";
import {MONGOOSE_SCHEMA} from "../constants/constants.js";

describe("@Select()", () => {
  it("should set metadata", () => {
    class Test {
      @Select()
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      select: true
    });
  });
});
