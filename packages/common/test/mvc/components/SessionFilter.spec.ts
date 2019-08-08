import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import {SessionFilter} from "../../../src/mvc/components/SessionFilter";

describe("QueryParamsFilter", () => {
  before(
    inject([SessionFilter], (filter: SessionFilter) => {
      this.filter = filter;
    })
  );
  after(TestContext.reset);

  describe("transform()", () => {
    before(() => {
      this.result = this.filter.transform("test", {session: {test: "test"}});
    });

    it("should transform expression", () => {
      expect(this.result).to.equal("test");
    });
  });
});
