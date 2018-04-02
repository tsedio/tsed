import {HeaderParamsFilter} from "../../../../src/common/filters/components/HeaderParamsFilter";
import {inject} from "../../../../src/testing/inject";
import {expect} from "../../../tools";


describe("HeaderParamsFilter", () => {

    before(inject([HeaderParamsFilter], (filter: HeaderParamsFilter) => {
        this.filter = filter;
    }));

    describe("transform()", () => {
        before(() => {
            this.result = this.filter.transform("test", {get: () => "test"});
        });

        it("should transform expression", () => {
            expect(this.result).to.equal("test");
        });
    });
});