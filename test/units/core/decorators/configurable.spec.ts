import {expect} from "chai";
import {NotConfigurable} from "../../../../packages/core/decorators";
import {Configurable} from "../../../../packages/core/decorators/configurable";
import {descriptorOf} from "../../../../packages/core/utils";

class Test {
  test: string;
}

describe("Configurable", () => {
  it("should set attribut as configurable", () => {
    Configurable()(Test, "test");
    expect(descriptorOf(Test, "test").configurable).to.eq(true);
  });

  it("should set attribut as not configurable", () => {
    NotConfigurable()(Test, "test");
    expect(descriptorOf(Test, "test").configurable).to.eq(false);
  });
});
