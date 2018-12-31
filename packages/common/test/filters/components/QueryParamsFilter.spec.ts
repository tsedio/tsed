import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import {QueryParamsFilter} from "../../../src/filters/components/QueryParamsFilter";

describe("QueryParamsFilter", () => {
  before(
    inject([QueryParamsFilter], (filter: QueryParamsFilter) => {
      this.filter = filter;
    })
  );
  after(TestContext.reset);

  describe("transform()", () => {
    before(() => {
      this.result = this.filter.transform("test", {query: {test: "test"}});
    });

    it("should transform expression", () => {
      expect(this.result).to.equal("test");
    });
  });
});
