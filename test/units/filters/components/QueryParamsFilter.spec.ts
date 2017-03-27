import {assert, expect} from "chai";
import {inject} from "../../../../src/testing/inject";
import {FilterService} from "../../../../src/filters/services/FilterService";
import {QueryParamsFilter} from "../../../../src/filters/components/QueryParamsFilter";


describe("QueryParamsFilter", () => {

    before(inject([FilterService], (filterService: FilterService) => {
        this.filterService = filterService;
        this.bodyParamsFilter = filterService.invoke<QueryParamsFilter>(QueryParamsFilter);
    }));

    after(() => {
        delete this.filterService;
        delete this.bodyParamsFilter;
    });

    it("should instance of", () => {
        expect(this.bodyParamsFilter).to.be.an.instanceof(QueryParamsFilter);
    });

    describe("transform()", () => {
        before(() => {
            this.result = this.bodyParamsFilter.transform("test", {query: {test: "test"}});
        });
        after(() => delete this.result);

        it("should transform expression", () => {
            expect(this.result).to.equal("test");
        });
    });
});