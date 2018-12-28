import {expect} from "chai";
import {NotConfigurable} from "@tsed/core";
import {Configurable} from "@tsed/core";
import {descriptorOf} from "@tsed/core";

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
