import {inject, TestContext} from "@tsed/testing";
import {RestCtrl} from "./RestCtrl";

describe("RestCtrl", () => {
  before(() => TestContext.create());
  after(() => TestContext.reset());

  it("should be a RestCtrl", inject([RestCtrl], (restCtrl: RestCtrl) => {
    restCtrl.should.be.instanceof(RestCtrl);
  }));
});
