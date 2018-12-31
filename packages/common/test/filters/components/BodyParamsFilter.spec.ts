import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import {BodyParamsFilter} from "../../../src/filters/components/BodyParamsFilter";

describe("BodyParamsFilter", () => {
  before(
    inject([BodyParamsFilter], (filter: BodyParamsFilter) => {
      this.filter = filter;
    })
  );
  after(TestContext.reset);

  describe("transform()", () => {
    before(() => {
      this.result = this.filter.transform("test", {body: {test: "test"}});
    });

    it("should transform expression", () => {
      expect(this.result).to.equal("test");
    });
  });
});
