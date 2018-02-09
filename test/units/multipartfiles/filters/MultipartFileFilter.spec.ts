import {expect} from "chai";
import {FilterService} from "../../../../src/common/filters/services/FilterService";
import {MultipartFileFilter} from "../../../../src/multipartfiles/filters/MultipartFileFilter";
import {MultipartFilesFilter} from "../../../../src/multipartfiles/filters/MultipartFilesFilter";
import {inject} from "../../../../src/testing";

describe("MultipartFileFilter", () => {

    before(inject([FilterService], (filterService: FilterService) => {
        this.filterService = filterService;
        this.filter = filterService.invoke<MultipartFileFilter>(MultipartFileFilter);
    }));

    after(() => {
        delete this.filterService;
        delete this.filter;
    });

    it("should instance of", () => {
        expect(this.filter).to.be.an.instanceof(MultipartFileFilter);
    });

    describe("transform()", () => {
        before(() => {
            this.result = this.filter.transform("", {files: [{}]});
        });
        after(() => delete this.result);

        it("should transform expression", () => {
            expect(this.result).to.be.an("object");
        });
    });
});

describe("MultipartFilesFilter", () => {

    before(inject([FilterService], (filterService: FilterService) => {
        this.filterService = filterService;
        this.filter = filterService.invoke<MultipartFilesFilter>(MultipartFilesFilter);
    }));

    after(() => {
        delete this.filterService;
        delete this.filter;
    });

    it("should instance of", () => {
        expect(this.filter).to.be.an.instanceof(MultipartFilesFilter);
    });

    describe("transform()", () => {
        before(() => {
            this.result = this.filter.transform("", {files: [{}]});
        });
        after(() => delete this.result);

        it("should transform expression", () => {
            expect(this.result).to.be.an("array");
        });
    });
});