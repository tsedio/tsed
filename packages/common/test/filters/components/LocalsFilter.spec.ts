import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import {LocalsFilter} from "../../../src/filters/components/LocalsFilter";

describe("LocalsFilter", () => {
  before(
    inject([LocalsFilter], (filter: LocalsFilter) => {
      this.filter = filter;
    })
  );
  after(TestContext.reset);

  describe("transform()", () => {
    before(() => {
      this.result = this.filter.transform("test", {}, {locals: {test: "test"}});
    });

    it("should transform expression", () => {
      expect(this.result).to.equal("test");
    });
  });
});
