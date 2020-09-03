import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {MONGOOSE_SCHEMA} from "../constants";
import {Indexed} from "./indexed";

describe("@Indexed()", () => {
  it("should set metadata", () => {
    class Test {}

    Indexed()(Test, "test", descriptorOf(Test, "test"));
    const store = Store.from(Test, "test", descriptorOf(Test, "test"));

    expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      index: true
    });
  });
});
