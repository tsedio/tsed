import {expect} from "chai";
import {BodyParamsFilter} from "../../../../src/filters/components/BodyParamsFilter";
import {FilterService} from "../../../../src/filters/services/FilterService";
import {inject} from "../../../../src/testing/inject";


describe("BodyParamsFilter", () => {

    before(inject([FilterService], (filterService: FilterService) => {
        this.filterService = filterService;
        this.bodyParamsFilter = filterService.invoke<BodyParamsFilter>(BodyParamsFilter);
    }));

    describe("transform()", () => {
        before(() => {
            this.result = this.bodyParamsFilter.transform("test", {body: {test: "test"}});
        });

        it("should transform expression", () => {
            expect(this.result).to.equal("test");
        });
    });
});