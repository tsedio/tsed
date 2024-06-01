import {Configurable, descriptorOf, NotConfigurable} from "../../src/index.js";

class Test {
  test: string;
}

describe("Configurable", () => {
  it("should set attribut as configurable", () => {
    Configurable()(Test, "test");
    expect(descriptorOf(Test, "test").configurable).toBe(true);
  });

  it("should set attribut as not configurable", () => {
    NotConfigurable()(Test, "test");
    expect(descriptorOf(Test, "test").configurable).toBe(false);
  });
});
