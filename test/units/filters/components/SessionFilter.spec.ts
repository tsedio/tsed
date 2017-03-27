import {assert, expect} from "chai";
import {inject} from "../../../../src/testing/inject";
import {FilterService} from "../../../../src/filters/services/FilterService";
import {SessionFilter} from "../../../../src/filters/components/SessionFilter";

describe("QueryParamsFilter", () => {

    before(inject([FilterService], (filterService: FilterService) => {
        this.filterService = filterService;
        this.filter = filterService.invoke<SessionFilter>(SessionFilter);
    }));

    after(() => {
        delete this.filterService;
        delete this.filter;
    });

    it("should instance of", () => {
        expect(this.filter).to.be.an.instanceof(SessionFilter);
    });

    describe("transform()", () => {
        before(() => {
            this.result = this.filter.transform("test", {session: {test: "test"}});
        });
        after(() => delete this.result);

        it("should transform expression", () => {
            expect(this.result).to.equal("test");
        });
    });
});