import {ExpressApplication, Injectable, PlatformTest} from "@tsed/common";
import {expect} from "chai";

describe("ExpressApplication", () => {
  before(PlatformTest.create);
  after(PlatformTest.reset);

  it("should inject express application", async () => {
    @Injectable()
    class MyService {
      constructor(@ExpressApplication public expressApp: ExpressApplication) {}
    }

    expect(!!(await PlatformTest.invoke(MyService).expressApp)).to.equal(true);
  });
});
