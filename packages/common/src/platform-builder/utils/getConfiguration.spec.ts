import {Configuration, getConfiguration} from "@tsed/common";

describe("getConfiguration", () => {
  it("should return configuration", () => {
    @Configuration({test: "test"})
    class MyModule {}

    getConfiguration(MyModule).should.deep.eq({
      test: "test"
    });
  });
});
