import {assert, expect} from "chai";
import {ParseExpressionError} from "../../../../src/mvc/errors/ParseExpressionError";

describe("ParseExpressionError", () => {

    before(() => {
        this.errorInstance = new ParseExpressionError("name", "expression", "message");
    });

    after(() => {
        delete this.errorInstance;
    });

    it("should have a message", () => {
        expect(this.errorInstance.message).to.equal("Bad request, parameter request.name.expression. message");
    });

    it("should have a name", () => {
        expect(this.errorInstance.name).to.equal("BAD_REQUEST");
    });

});