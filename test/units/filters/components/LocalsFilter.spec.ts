import {assert, expect} from "chai";
import {inject} from "../../../../src/testing/inject";
import {FilterService} from "../../../../src/filters/services/FilterService";
import {LocalsFilter} from "../../../../src/filters/components/LocalsFilter";


describe("LocalsFilter", () => {

    before(inject([FilterService], (filterService: FilterService) => {
        this.filterService = filterService;
        this.filter = filterService.invoke<LocalsFilter>(LocalsFilter);
    }));

    after(() => {
        delete this.filter;
        delete this.filterService;
    });

    it("should instance of", () => {
        expect(this.filter).to.be.an.instanceof(LocalsFilter);
    });

    describe("transform()", () => {
        before(() => {
            this.result = this.filter.transform("test", {}, {locals: {test: "test"}});
        });
        after(() => delete this.result);

        it("should transform expression", () => {
            expect(this.result).to.equal("test");
        });
    });
});