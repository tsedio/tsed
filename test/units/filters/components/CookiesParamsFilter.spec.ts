import {CookiesFilter} from "../../../../packages/common/src/filters/components/CookiesFilter";
import {inject} from "@tsed/testing";
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

    it("should transform expression", () => {
      expect(this.result).to.equal("test");
    });
  });
});
