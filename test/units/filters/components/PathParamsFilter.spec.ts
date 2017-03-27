import {assert, expect} from "chai";
import {inject} from "../../../../src/testing/inject";
import {FilterService} from "../../../../src/filters/services/FilterService";
import {PathParamsFilter} from "../../../../src/filters/components/PathParamsFilter";


describe("PathParamsFilter", () => {

    before(inject([FilterService], (filterService: FilterService) => {
        this.filterService = filterService;
        this.bodyParamsFilter = filterService.invoke<PathParamsFilter>(PathParamsFilter);
    }));

    after(() => {
        delete this.filterService;
        delete this.bodyParamsFilter;
    });

    it("should instance of", () => {
        expect(this.bodyParamsFilter).to.be.an.instanceof(PathParamsFilter);
    });

    describe("transform()", () => {
        before(() => {
            this.result = this.bodyParamsFilter.transform("test", {params: {test: "test"}});
        });
        after(() => delete this.result);

        it("should transform expression", () => {
            expect(this.result).to.equal("test");
        });
    });
});