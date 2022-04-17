import {Configuration, getConfiguration} from "@tsed/di";
import {expect} from "chai";

class MyController1 {}
class MyController2 {}

describe("getConfiguration", () => {
  it("should return configuration", () => {
    @Configuration({test: "test"})
    class MyModule {}

    expect(getConfiguration(MyModule)).to.deep.eq({
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
    ).to.deep.eq({
      mount: {
        "/v1": [MyController1],
        "/v2": [MyController2]
      }
    });
  });
});
