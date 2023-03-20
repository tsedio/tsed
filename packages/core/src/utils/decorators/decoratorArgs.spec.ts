import {descriptorOf} from "../objects/descriptorOf";
import {prototypeOf} from "../objects/prototypeOf";
import {decoratorArgs} from "./decoratorArgs";

describe("decoratorArgs", () => {
  it("should return decorator arguments", () => {
    class Test {
      test() {}
    }

    const args = decoratorArgs(prototypeOf(Test), "test");

    expect(args).toEqual([prototypeOf(Test), "test", descriptorOf(Test, "test")]);
  });
});
