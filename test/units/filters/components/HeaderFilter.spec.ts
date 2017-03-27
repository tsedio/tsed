import {assert, expect} from "chai";
import {inject} from "../../../../src/testing/inject";
import {FilterService} from "../../../../src/filters/services/FilterService";
import {HeaderParamsFilter} from "../../../../src/filters/components/HeaderParamsFilter";


describe("HeaderParamsFilter", () => {

    before(inject([FilterService], (filterService: FilterService) => {
        this.filterService = filterService;
        this.filter = filterService.invoke<HeaderParamsFilter>(HeaderParamsFilter);
    }));

    after(() => {
        delete this.filter;
        delete this.filterService;
    });

    it("should instance of", () => {
        expect(this.filter).to.be.an.instanceof(HeaderParamsFilter);
    });

    describe("transform()", () => {
        before(() => {
            this.result = this.filter.transform("test", {get: () => "test"});
        });
        after(() => delete this.result);

        it("should transform expression", () => {
            expect(this.result).to.equal("test");
        });
    });
});