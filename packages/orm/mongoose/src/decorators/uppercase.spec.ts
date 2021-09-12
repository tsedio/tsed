import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {MONGOOSE_SCHEMA} from "../../src/constants";
import {Uppercase} from "./uppercase";

describe("@Uppercase()", () => {
  it("should set metadata (default)", () => {
    class Test {
      @Uppercase()
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      uppercase: true
    });
  });

  it("should set metadata (true)", () => {
    class Test {
      @Uppercase(true)
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      uppercase: true
    });
  });
});
