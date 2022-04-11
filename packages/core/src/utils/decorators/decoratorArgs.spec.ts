import {decoratorArgs, descriptorOf, prototypeOf} from "@tsed/core";

describe("decoratorArgs", () => {
  it("should return decorator arguments", () => {
    class Test {
      test() {}
    }

    const args = decoratorArgs(prototypeOf(Test), "test");

    expect(args).toEqual([prototypeOf(Test), "test", descriptorOf(Test, "test")]);
  });
});
