import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {MONGOOSE_SCHEMA} from "../../src/constants";
import {Text} from "./text";

describe("@Text()", () => {
  it("should set metadata (default)", () => {
    class Test {
      @Text()
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      text: true
    });
  });

  it("should set metadata (true)", () => {
    class Test {
      @Text(true)
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      text: true
    });
  });
});
