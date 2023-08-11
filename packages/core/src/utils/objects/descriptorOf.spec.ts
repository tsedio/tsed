import {isMethodDescriptor} from "./descriptorOf";

describe("isMethodDescriptor()", () => {
  it("should return true", () => {
    class Test {
      test() {}
    }
    expect(isMethodDescriptor(Test, "test")).toBeTruthy();
  });
  it("should return false", () => {
    class Test {
      test: string;
    }
    expect(isMethodDescriptor(Test, "test")).toBeFalsy();
  });
});
