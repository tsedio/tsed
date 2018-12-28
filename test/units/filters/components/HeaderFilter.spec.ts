import {HeaderParamsFilter} from "../../../../packages/common/src/filters/components/HeaderParamsFilter";
import {inject} from "@tsed/testing";
import {expect} from "chai";

describe("HeaderParamsFilter", () => {
  before(
    inject([HeaderParamsFilter], (filter: HeaderParamsFilter) => {
      this.filter = filter;
    })
  );

  describe("transform()", () => {
    before(() => {
      this.result = this.filter.transform("test", {get: () => "test"});
    });

    it("should transform expression", () => {
      expect(this.result).to.equal("test");
    });
  });
});
