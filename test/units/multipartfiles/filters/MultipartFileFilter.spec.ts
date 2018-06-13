import {expect} from "chai";
import {MultipartFileFilter} from "../../../../src/multipartfiles/components/MultipartFileFilter";
import {MultipartFilesFilter} from "../../../../src/multipartfiles/components/MultipartFilesFilter";
import {inject} from "../../../../src/testing";

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
