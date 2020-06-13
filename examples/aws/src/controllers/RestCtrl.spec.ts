import {PlatformTest} from "@tsed/common";
import {RestCtrl} from "./RestCtrl";

describe("RestCtrl", () => {
  before(() => PlatformTest.create());
  after(() => PlatformTest.reset());

  it("should be a RestCtrl", PlatformTest.inject([RestCtrl], (restCtrl: RestCtrl) => {
    restCtrl.should.be.instanceof(RestCtrl);
  }));
});
