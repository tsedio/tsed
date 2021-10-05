import {descriptorOf, Store} from "@tsed/core";
import {MONGOOSE_SCHEMA} from "../../src/constants";
import {Select} from "../../src/decorators";

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
