import {Container, createContainer, Module} from "@tsed/di";

describe("createContainer", () => {
  it("should createContainer", () => {
    expect(createContainer()).toBeInstanceOf(Container);
  });

  it("should createContainer without rootModule", () => {
    @Module()
    class MyModule {}

    const container = createContainer(MyModule);

    expect(container.has(MyModule)).toEqual(false);
  });
});
