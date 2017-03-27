import {assert, expect} from "../../../tools";

import {FakeRequest} from "../../../helper";
import {inject} from "../../../../src/testing";
import {HeaderParamsFilter} from "../../../../src/filters/components/HeaderParamsFilter";
import {FakeResponse} from "../../../helper/FakeResponse";
import {FilterService} from "../../../../src/filters/services/FilterService";
import {FilterProvider} from "../../../../src/filters/class/FilterProvider";

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
            const list = [];
            this.filterService.forEach((f) => list.push(f));
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