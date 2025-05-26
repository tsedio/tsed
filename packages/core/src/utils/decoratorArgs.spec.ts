import {decoratorArgs} from "./decoratorArgs.js";
import {descriptorOf} from "./descriptorOf.js";
import {prototypeOf} from "./prototypeOf.js";

describe("decoratorArgs", () => {
  it("should return decorator arguments", () => {
    class Test {
      test() {}
    }

    const args = decoratorArgs(prototypeOf(Test), "test");

    expect(args).toEqual([prototypeOf(Test), "test", descriptorOf(Test, "test")]);
  });
});
