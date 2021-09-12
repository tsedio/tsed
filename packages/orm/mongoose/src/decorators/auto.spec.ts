import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {MONGOOSE_SCHEMA} from "../../src/constants";
import {Auto} from "./auto";

describe("@Auto()", () => {
  it("should set metadata (default)", () => {
    class Test {
      @Auto()
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      auto: true
    });
  });

  it("should set metadata (true)", () => {
    class Test {
      @Auto(true)
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      auto: true
    });
  });
});
