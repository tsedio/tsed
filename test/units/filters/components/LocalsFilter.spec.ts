import {LocalsFilter} from "../../../../packages/common/filters/components/LocalsFilter";
import {inject} from "../../../../packages/testing/inject";
import {expect} from "../../../tools";

describe("LocalsFilter", () => {
  before(
    inject([LocalsFilter], (filter: LocalsFilter) => {
      this.filter = filter;
    })
  );

  describe("transform()", () => {
    before(() => {
      this.result = this.filter.transform("test", {}, {locals: {test: "test"}});
    });

    it("should transform expression", () => {
      expect(this.result).to.equal("test");
    });
  });
});
