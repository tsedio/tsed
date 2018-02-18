import {FilterProvider} from "../../../../src/common/filters/class/FilterProvider";
import {HeaderParamsFilter} from "../../../../src/common/filters/components/HeaderParamsFilter";
import {FilterService} from "../../../../src/common/filters/services/FilterService";
import {inject} from "../../../../src/testing";

import {FakeRequest} from "../../../helper";
import {FakeResponse} from "../../../helper/FakeResponse";
import {assert, expect} from "../../../tools";

class Test {

}

describe("FilterService", () => {

    before(inject([FilterService], (filterService: FilterService) => {
        this.filterService = filterService;
    }));

    describe("get()", () => {
        before(() => {
            this.provider = new FilterProvider(Test);
            FilterService.set(Test, this.provider);
        });

        it("should return true", () => {
            expect(FilterService.has(Test)).to.eq(true);
        });
        it("should return provider", () => {
            expect(FilterService.get(Test)).to.eq(this.provider);
        });
    });

    describe("invokeMethod()", () => {
        it("should invoke method from a filter", () => {
            expect(this.filterService.invokeMethod(
                HeaderParamsFilter,
                "x-token",
                new FakeRequest,
                new FakeResponse
            )).to.equal("headerValue");
        });

        it("should throw an error when filter isn't known", () => {
            assert.throws(() => {
                this.filterService.invokeMethod(
                    class T {
                    },
                    "x-token",
                    new FakeRequest,
                    new FakeResponse
                );
            }, "Filter T not found");
        });

    });

    describe("forEach()", () => {
        it("should loop on registry", () => {
            const list: any = [];
            this.filterService.forEach((f: any) => list.push(f));
            expect(!!list.length).to.be.true;
        });
    });

    describe("set()", () => {
        it("should set a filter", () => {
            const headerFilter = new HeaderParamsFilter();
            this.filterService.set(HeaderParamsFilter, {instance: headerFilter});
            expect(this.filterService.get(HeaderParamsFilter).instance).to.equals(headerFilter);
        });
    });

    describe("size()", () => {
        it("should return size", () => {
            expect(!!this.filterService.size).to.be.true;
        });
    });
});