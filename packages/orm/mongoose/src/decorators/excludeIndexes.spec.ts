import {descriptorOf, Store} from "@tsed/core";
import {MONGOOSE_SCHEMA} from "../../src/constants";
import {ExcludeIndexes} from "./excludeIndexes";

describe("@ExcludeIndexes()", () => {
  it("should set metadata (default)", () => {
    class Test {
      @ExcludeIndexes()
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      excludeIndexes: true
    });
  });

  it("should set metadata (true)", () => {
    class Test {
      @ExcludeIndexes(true)
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      excludeIndexes: true
    });
  });
});
