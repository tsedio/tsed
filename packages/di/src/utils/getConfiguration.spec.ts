import {Configuration} from "../decorators/configuration";
import {getConfiguration} from "./getConfiguration";

class MyController1 {}

class MyController2 {}

describe("getConfiguration", () => {
  it("should return configuration", () => {
    @Configuration({test: "test"})
    class MyModule {}

    expect(getConfiguration(MyModule)).toEqual({
      test: "test",
      mount: {}
    });
  });

  it("should return configuration (2)", () => {
    @Configuration({
      mount: {
        "/v1": [MyController1]
      }
    })
    class MyModule {}

    expect(
      getConfiguration(MyModule, {
        mount: {
          "/v2": [MyController2]
        }
      })
    ).toEqual({
      mount: {
        "/v1": [MyController1],
        "/v2": [MyController2]
      }
    });
  });
});
