import {MiddlewareProvider} from "../../../../src/mvc/class/MiddlewareProvider";
import {MiddlewareType} from "../../../../src/mvc/interfaces/Middleware";
import {expect} from "../../../tools";

class Test {

}

describe("MiddlewareProvider", () => {

    describe("with type as enum", () => {
        before(() => {
            this.provider = new MiddlewareProvider(Test);
            this.provider.type = MiddlewareType.ERROR;
        });

        it("should get type", () => {
            expect(this.provider.type).to.eq(MiddlewareType.ERROR);
        });

    });

    describe("with type as string", () => {
        before(() => {
            this.provider = new MiddlewareProvider(Test);
            this.provider.type = "ERROR";
        });

        it("should get type", () => {
            expect(this.provider.type).to.eq(MiddlewareType.ERROR);
        });

    });

});