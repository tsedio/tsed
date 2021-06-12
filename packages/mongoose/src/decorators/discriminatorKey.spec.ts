import {Store} from "@tsed/core";
import {expect} from "chai";
import {MONGOOSE_SCHEMA_OPTIONS} from "../constants";
import {Model} from ".";
import {DiscriminatorKey} from "./discriminatorKey";

describe("@DiscriminatorKey()", () => {
  it("should set metadata", () => {
    @Model()
    class Test {
      @DiscriminatorKey()
      type: string;
    }

    expect(Store.from(Test).get(MONGOOSE_SCHEMA_OPTIONS)).to.deep.eq({
      discriminatorKey: "type"
    });
  });
});
