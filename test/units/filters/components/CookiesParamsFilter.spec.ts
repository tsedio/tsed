import {assert, expect} from "chai";
import {inject} from "../../../../src/testing/inject";
import {FilterService} from "../../../../src/filters/services/FilterService";
import {CookiesFilter} from "../../../../src/filters/components/CookiesFilter";


describe("CookiesFilter", () => {

    before(inject([FilterService], (filterService: FilterService) => {
        this.filterService = filterService;
        this.filter = filterService.invoke<CookiesFilter>(CookiesFilter);
    }));

    after(() => {
        delete this.filterService;
        delete this.filter;
    });

    it("should instance of", () => {
        expect(this.filter).to.be.an.instanceof(CookiesFilter);
    });

    describe("transform()", () => {
        before(() => {
            this.result = this.filter.transform("test", {cookies: {test: "test"}});
        });
        after(() => delete this.result);

        it("should transform expression", () => {
            expect(this.result).to.equal("test");
        });
    });
});