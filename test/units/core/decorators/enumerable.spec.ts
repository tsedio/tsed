import {expect} from "chai";
import {NotEnumerable} from "../../../../packages/core/src/decorators";
import {Enumerable} from "../../../../packages/core/src/decorators/enumerable";
import {descriptorOf} from "../../../../packages/core/src/utils";

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
