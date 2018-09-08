import {expect} from "chai";
import {SessionFilter} from "../../../../packages/common/src/filters/components/SessionFilter";
import {inject} from "../../../../packages/testing/src/inject";

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
