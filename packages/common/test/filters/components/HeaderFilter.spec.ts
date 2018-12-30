import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import {HeaderParamsFilter} from "../../../src/filters/components/HeaderParamsFilter";

describe("HeaderParamsFilter", () => {
  before(
    inject([HeaderParamsFilter], (filter: HeaderParamsFilter) => {
      this.filter = filter;
    })
  );
  after(TestContext.reset);

  describe("transform()", () => {
    before(() => {
      this.result = this.filter.transform("test", {get: () => "test"});
    });

    it("should transform expression", () => {
      expect(this.result).to.equal("test");
    });
  });
});
