import {expect} from "chai";
import {QueryParamsFilter} from "../../../../packages/common/src/filters/components/QueryParamsFilter";
import {inject} from "@tsed/testing";

describe("QueryParamsFilter", () => {
  before(
    inject([QueryParamsFilter], (filter: QueryParamsFilter) => {
      this.filter = filter;
    })
  );

  describe("transform()", () => {
    before(() => {
      this.result = this.filter.transform("test", {query: {test: "test"}});
    });

    it("should transform expression", () => {
      expect(this.result).to.equal("test");
    });
  });
});
