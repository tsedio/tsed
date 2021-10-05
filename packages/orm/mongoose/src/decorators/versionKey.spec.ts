import {Store} from "@tsed/core";
import {MONGOOSE_SCHEMA_OPTIONS} from "../constants";
import {Model} from ".";
import {VersionKey} from "./versionKey";

describe("@VersionKey()", () => {
  it("should set metadata", () => {
    @Model()
    class TestVersionKey {
      @VersionKey()
      rev: number;
    }

    expect(Store.from(TestVersionKey).get(MONGOOSE_SCHEMA_OPTIONS)).toEqual({
      versionKey: "rev"
    });
  });
});
