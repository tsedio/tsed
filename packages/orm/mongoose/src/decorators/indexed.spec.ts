import {Store} from "@tsed/core";

import {MONGOOSE_SCHEMA} from "../constants/constants.js";
import {Indexed} from "./indexed.js";

describe("@Indexed()", () => {
  it("should set metadata", () => {
    class Test {
      @Indexed()
      test: string;
    }

    const store = Store.from(Test, "test");

    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      index: true
    });
  });
});
