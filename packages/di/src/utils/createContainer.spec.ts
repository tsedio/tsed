import {Module} from "../decorators/module";
import {Container} from "../domain/Container";
import {createContainer} from "./createContainer";

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
