import {Configuration, getConfiguration} from "@tsed/common";
import {expect} from "chai";

describe("getConfiguration", () => {
  it("should return configuration", () => {
    @Configuration({test: "test"})
    class MyModule {
    }

    expect(getConfiguration(MyModule)).to.deep.eq({
      test: "test"
    });
  });
});
