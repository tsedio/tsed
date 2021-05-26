import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {MONGOOSE_SCHEMA} from "../../src/constants";
import {Expires} from "./expires";

describe("@Expires()", () => {
  it("should set metadata", () => {
    class Test {
      @Expires("5d")
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      expires: "5d"
    });
  });
});
