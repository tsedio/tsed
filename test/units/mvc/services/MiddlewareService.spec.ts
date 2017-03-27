import {assert, expect} from "../../../tools";

import {MiddlewareProvider} from "../../../../src/mvc/class/MiddlewareProvider";
import {MiddlewareService} from "../../../../src/mvc/services/MiddlewareService";
import {inject} from "../../../../src/testing/inject";


class Test {
    use() {
        return "headerValue";
    }
}

describe("MiddlewareService", () => {

    describe("get()", () => {
        before(() => {
            this.provider = new MiddlewareProvider(Test);
            MiddlewareService.set(Test, this.provider);
        });

        it("should return true", () => {
            expect(MiddlewareService.has(Test)).to.eq(true);
        });
        it("should return provider", () => {
            expect(MiddlewareService.get(Test)).to.eq(this.provider);
        });
    });

    describe("invokeMethod()", () => {
        before(inject([MiddlewareService], (middlewareService: MiddlewareService) => {
            this.middlewareService = middlewareService;
        }));

        it("should invoke method from a filter", () => {
            expect(this.middlewareService.invokeMethod(
                Test,
                {}
            )).to.equal("headerValue");
        });

        it("should throw an error when middleware isn't known", () => {
            assert.throws(() => {
                this.middlewareService.invokeMethod(
                    class T {
                    }
                );
            }, "Middleware T not found");
        });

    });

});