import {inject} from "@tsed/testing";
import {expect} from "chai";
import {TestContext} from "../../../testing/src";
import {MultipartFileFilter} from "../../src/components/MultipartFileFilter";
import {MultipartFilesFilter} from "../../src/components/MultipartFilesFilter";

describe("MultipartFileFilter", () => {
  before(
    inject([MultipartFileFilter], (filter: MultipartFileFilter) => {
      this.filter = filter;
    })
  );
  after(TestContext.reset);

  describe("transform()", () => {
    before(() => {
      this.result = this.filter.transform("", {files: [{}]});
    });

    it("should transform expression", () => {
      expect(this.result).to.be.an("object");
    });
  });
});

describe("MultipartFilesFilter", () => {
  describe("legacy", () => {
    before(
      inject([MultipartFilesFilter], (filter: MultipartFilesFilter) => {
        this.filter = filter;
      })
    );

    describe("transform()", () => {
      before(() => {
        this.result = this.filter.transform("", {files: [{}]});
      });

      it("should transform expression", () => {
        expect(this.result).to.be.an("array");
      });
    });
  });

  describe("new feature", () => {
    before(
      inject([MultipartFilesFilter], (filter: MultipartFilesFilter) => {
        this.filter = filter;
      })
    );

    describe("transform()", () => {
      before(() => {
        this.result = this.filter.transform("test", {
          files: {
            test: []
          }
        });
      });

      it("should transform expression", () => {
        expect(this.result).to.be.an("array");
      });
    });
  });
});
