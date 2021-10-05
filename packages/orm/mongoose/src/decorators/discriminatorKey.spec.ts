import {Store} from "@tsed/core";
import {MONGOOSE_SCHEMA_OPTIONS} from "../constants";
import {Model} from ".";
import {DiscriminatorKey} from "./discriminatorKey";

describe("@DiscriminatorKey()", () => {
  it("should set metadata", () => {
    @Model()
    class TestDiscriminatorKey {
      @DiscriminatorKey()
      type: string;
    }

    expect(Store.from(TestDiscriminatorKey).get(MONGOOSE_SCHEMA_OPTIONS)).toEqual({
      discriminatorKey: "type"
    });
  });
});
