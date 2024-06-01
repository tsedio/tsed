import {Module} from "../decorators/module.js";
import {Container} from "../domain/Container.js";
import {createContainer} from "./createContainer.js";

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
