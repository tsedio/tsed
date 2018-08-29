import {expect} from "chai";
import {PathParamsFilter} from "../../../../packages/common/filters/components/PathParamsFilter";
import {inject} from "../../../../packages/testing/inject";

describe("PathParamsFilter", () => {
  before(
    inject([PathParamsFilter], (filter: PathParamsFilter) => {
      this.filter = filter;
    })
  );

  describe("transform()", () => {
    before(() => {
      this.result = this.filter.transform("test", {params: {test: "test"}});
    });

    it("should transform expression", () => {
      expect(this.result).to.equal("test");
    });
  });
});
