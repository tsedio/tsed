import {assert, expect} from "chai";
import {inject} from "../../../../src/testing/inject";
import {FilterService} from "../../../../src/filters/services/FilterService";
import {BodyParamsFilter} from "../../../../src/filters/components/BodyParamsFilter";


describe("BodyParamsFilter", () => {

    before(inject([FilterService], (filterService: FilterService) => {
        this.filterService = filterService;
        this.bodyParamsFilter = filterService.invoke<BodyParamsFilter>(BodyParamsFilter);
    }));

    after(() => {
        delete this.filterService;
        delete this.bodyParamsFilter;
    });

    it("should instance of", () => {
        expect(this.bodyParamsFilter).to.be.an.instanceof(BodyParamsFilter);
    });

    describe("transform()", () => {
        before(() => {
            this.result = this.bodyParamsFilter.transform("test", {body: {test: "test"}});
        });
        after(() => delete this.result);

        it("should transform expression", () => {
            expect(this.result).to.equal("test");
        });
    });
});