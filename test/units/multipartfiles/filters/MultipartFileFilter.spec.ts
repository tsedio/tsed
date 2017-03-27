import {assert, expect} from "chai";
import {inject} from "../../../../src/testing/inject";
import {FilterService} from "../../../../src/filters/services/FilterService";
import {MultipartFileFilter, MultipartFilesFilter} from "../../../../src/multipartfiles/filters/MultipartFileFilter";

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