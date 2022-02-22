import {Deprecated} from "./deprecated";
import {deprecate} from "util";

jest.mock("util");

describe("Deprecated", () => {
  it("should wrap method as deprecated", () => {
    class Test {
      @Deprecated("test")
      test() {}
    }

    new Test();

    expect(deprecate).toHaveBeenCalledWith(expect.any(Function), "test");
  });
});
