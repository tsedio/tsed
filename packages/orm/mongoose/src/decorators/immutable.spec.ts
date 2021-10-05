import {descriptorOf, Store} from "@tsed/core";
import {MONGOOSE_SCHEMA} from "../../src/constants";
import {Immutable} from "./immutable";

describe("@Immutable()", () => {
  it("should set metadata (default)", () => {
    class Test {
      @Immutable()
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      immutable: true
    });
  });

  it("should set metadata (true)", () => {
    class Test {
      @Immutable(true)
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      immutable: true
    });
  });
});
