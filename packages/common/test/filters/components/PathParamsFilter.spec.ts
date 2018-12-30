import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import {PathParamsFilter} from "../../../src/filters/components/PathParamsFilter";

describe("PathParamsFilter", () => {
  before(
    inject([PathParamsFilter], (filter: PathParamsFilter) => {
      this.filter = filter;
    })
  );
  after(TestContext.reset);

  describe("transform()", () => {
    before(() => {
      this.result = this.filter.transform("test", {params: {test: "test"}});
    });

    it("should transform expression", () => {
      expect(this.result).to.equal("test");
    });
  });
});
