import {getConfiguration} from "@tsed/common";
import {Module} from "@tsed/di";

describe("getConfiguration", () => {
  it("should return configuration", () => {
    @Module({test: "test"})
    class MyModule {}

    getConfiguration(MyModule).should.deep.eq({
      test: "test"
    });
  });
});
