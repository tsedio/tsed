import {Container, createContainer, Module} from "@tsed/common";
import {expect} from "chai";

describe("createContainer", () => {
  it("should createContainer", () => {
    expect(createContainer()).to.instanceof(Container);
  });

  it("should createContainer without rootModule", () => {
    @Module()
    class MyModule {}

    const container = createContainer(MyModule);

    expect(container.has(MyModule)).to.eq(false);
  });
});
