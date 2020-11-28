import {Store} from "@tsed/core";
import {expect} from "chai";
import {MONGOOSE_SCHEMA} from "../constants";
import {Indexed} from "./indexed";

describe("@Indexed()", () => {
  it("should set metadata", () => {
    class Test {
      @Indexed()
      test: string;
    }

    const store = Store.from(Test, "test");

    expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      index: true
    });
  });
});
