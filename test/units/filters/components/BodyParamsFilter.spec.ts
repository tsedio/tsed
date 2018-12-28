import {BodyParamsFilter} from "../../../../packages/common/src/filters/components/BodyParamsFilter";
import {inject} from "@tsed/testing";
import {expect} from "chai";

describe("BodyParamsFilter", () => {
  before(
    inject([BodyParamsFilter], (filter: BodyParamsFilter) => {
      this.filter = filter;
    })
  );

  describe("transform()", () => {
    before(() => {
      this.result = this.filter.transform("test", {body: {test: "test"}});
    });

    it("should transform expression", () => {
      expect(this.result).to.equal("test");
    });
  });
});
