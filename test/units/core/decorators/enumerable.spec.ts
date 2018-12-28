import {expect} from "chai";
import {NotEnumerable} from "@tsed/core";
import {Enumerable} from "@tsed/core";
import {descriptorOf} from "@tsed/core";

class Test {
  test: string;
}

describe("Enumerable", () => {
  it("should set attribut as enumerable", () => {
    Enumerable()(Test, "test");
    expect(descriptorOf(Test, "test").enumerable).to.eq(true);
  });
  it("should set attribut as not enumerable", () => {
    NotEnumerable()(Test, "test");
    expect(descriptorOf(Test, "test").enumerable).to.eq(false);
  });
});
