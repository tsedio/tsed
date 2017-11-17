import {assert, expect} from "chai";
import {RequiredParamError} from "../../../../src/filters/errors/RequiredParamError";

describe("RequiredParamError", () => {

    before(() => {
        this.errorInstance = new RequiredParamError("name", "expression");
    });

    after(() => {
        delete this.errorInstance;
    });

    it("should have a message", () => {
        expect(this.errorInstance.message).to.equal("Bad request, parameter request.name.expression is required.");
    });

    it("should have a name", () => {
        expect(this.errorInstance.name).to.equal("BAD_REQUEST");
    });

});