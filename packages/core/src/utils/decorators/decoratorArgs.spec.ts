import {descriptorOf} from "../objects/descriptorOf.js";
import {prototypeOf} from "../objects/prototypeOf.js";
import {decoratorArgs} from "./decoratorArgs.js";

describe("decoratorArgs", () => {
  it("should return decorator arguments", () => {
    class Test {
      test() {}
    }

    const args = decoratorArgs(prototypeOf(Test), "test");

    expect(args).toEqual([prototypeOf(Test), "test", descriptorOf(Test, "test")]);
  });
});
