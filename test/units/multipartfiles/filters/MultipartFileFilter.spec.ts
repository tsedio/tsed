import {expect} from "chai";
import {MultipartFileFilter} from "../../../../packages/multipartfiles/src/components/MultipartFileFilter";
import {MultipartFilesFilter} from "../../../../packages/multipartfiles/src/components/MultipartFilesFilter";
import {inject} from "@tsed/testing";

describe("MultipartFileFilter", () => {
  before(
    inject([MultipartFileFilter], (filter: MultipartFileFilter) => {
      this.filter = filter;
    })
  );

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
