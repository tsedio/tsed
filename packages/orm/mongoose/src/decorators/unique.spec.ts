import {Store} from "@tsed/core";
import {MONGOOSE_SCHEMA} from "../../src/constants";
import {Unique} from "../../src/decorators";

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
