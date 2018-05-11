import {CookiesFilter} from "../../../../src/common/filters/components/CookiesFilter";
import {inject} from "../../../../src/testing/inject";
import {expect} from "../../../tools";

describe("CookiesFilter", () => {
  before(
    inject([CookiesFilter], (filter: CookiesFilter) => {
      this.filter = filter;
    })
  );

  describe("transform()", () => {
    before(() => {
      this.result = this.filter.transform("test", {cookies: {test: "test"}});
    });
    after(() => delete this.result);

    it("should transform expression", () => {
      expect(this.result).to.equal("test");
    });
  });
});
