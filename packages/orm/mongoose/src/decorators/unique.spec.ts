import {Store} from "@tsed/core";
import {MONGOOSE_SCHEMA} from "../constants/constants.js";
import {Unique} from "../../src/index.js";

describe("@Unique()", () => {
  it("should set metadata", () => {
    class Test {
      @Unique()
      id: string;
    }

    const store = Store.from(Test, "id");
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      unique: true
    });
  });
});
