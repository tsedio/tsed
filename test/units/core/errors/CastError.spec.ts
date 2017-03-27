import {assert, expect} from "chai";
import {CastError} from "../../../../src/core/errors/CastError";

describe("CastError", () => {
    describe("constructor", () => {
        it("should create new instance", () => {
            assert.throws(() => {
                throw new CastError(new Error("origin message"));
            }, "origin message");
        });

        it("should wrap and store origin error", () => {
            const origin = new Error("origin message");
            const castError = new CastError(origin);
            expect(castError.origin).to.equal(origin);
        });
    });
});