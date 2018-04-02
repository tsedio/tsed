import {expect} from "chai";
import {QueryParamsFilter} from "../../../../src/common/filters/components/QueryParamsFilter";
import {inject} from "../../../../src/testing/inject";


describe("QueryParamsFilter", () => {

    before(inject([QueryParamsFilter], (filter: QueryParamsFilter) => {
        this.filter = filter;
    }));

    describe("transform()", () => {
        before(() => {
            this.result = this.filter.transform("test", {query: {test: "test"}});
        });

        it("should transform expression", () => {
            expect(this.result).to.equal("test");
        });
    });
});