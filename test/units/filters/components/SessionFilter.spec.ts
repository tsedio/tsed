import {expect} from "chai";
import {SessionFilter} from "../../../../src/common/filters/components/SessionFilter";
import {inject} from "../../../../src/testing/inject";

describe("QueryParamsFilter", () => {
  before(
    inject([SessionFilter], (filter: SessionFilter) => {
      this.filter = filter;
    })
  );

  describe("transform()", () => {
    before(() => {
      this.result = this.filter.transform("test", {session: {test: "test"}});
    });

    it("should transform expression", () => {
      expect(this.result).to.equal("test");
    });
  });
});
