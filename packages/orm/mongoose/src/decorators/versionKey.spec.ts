import {Store} from "@tsed/core";

import {MONGOOSE_SCHEMA_OPTIONS} from "../constants/constants.js";
import {Model} from "./model.js";
import {VersionKey} from "./versionKey.js";

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
