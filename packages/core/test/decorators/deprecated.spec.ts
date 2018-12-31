import {expect} from "chai";
import {Deprecated} from "../../src";

class Test {
  test() {
  }
}

describe("Deprecated", () => {
  it("should wrap method as deprecated", () => {
    expect(Deprecated("test")(Test, "test", {value: Test.prototype.test}).value).to.be.a("function");
  });
});
