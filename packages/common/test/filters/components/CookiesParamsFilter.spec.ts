import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import {CookiesFilter} from "../../../src/filters/components/CookiesFilter";

describe("CookiesFilter", () => {
  before(
    inject([CookiesFilter], (filter: CookiesFilter) => {
      this.filter = filter;
    })
  );
  after(TestContext.reset);

  describe("transform()", () => {
    before(() => {
      this.result = this.filter.transform("test", {cookies: {test: "test"}});
    });

    it("should transform expression", () => {
      expect(this.result).to.equal("test");
    });
  });
});
