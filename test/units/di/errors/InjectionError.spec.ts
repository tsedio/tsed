import {assert, expect} from "chai";
import {InjectionError} from "../../../../src/di/errors/InjectionError";

describe("InjectionError", () => {

    before(() => {
        this.errorInstance = new InjectionError(class Target {
        }, "SERVICE");
    });

    after(() => {
        delete this.errorInstance;
    });

    it("should have a message", () => {
        expect(this.errorInstance.message).to.equal("Service Target > SERVICE not found.");
    });

    it("should have a name", () => {
        expect(this.errorInstance.name).to.equal("INJECTION_ERROR");
    });

});