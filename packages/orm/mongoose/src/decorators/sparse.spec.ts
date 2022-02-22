import {descriptorOf, Store} from "@tsed/core";
import {MONGOOSE_SCHEMA} from "../constants/constants";
import {Sparse} from "./sparse";

describe("@Sparse()", () => {
  it("should set metadata (default)", () => {
    class Test {
      @Sparse()
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      sparse: true
    });
  });

  it("should set metadata (true)", () => {
    class Test {
      @Sparse(true)
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      sparse: true
    });
  });
});
