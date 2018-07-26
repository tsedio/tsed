import {BodyParamsFilter} from "../../../../packages/common/filters/components/BodyParamsFilter";
import {inject} from "../../../../packages/testing/inject";
import {expect} from "../../../tools";

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
