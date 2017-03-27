import {assert, expect} from "chai";
import {ConverterSerializationError} from "../../../../src/converters/errors/ConverterSerializationError";

describe("ConverterDeserializationError", () => {

    before(() => {
        this.genericError = new Error("test");
        this.errorInstance = new ConverterSerializationError(class Test {
        }, this.genericError);
    });

    after(() => {
        delete this.errorInstance;
        delete this.genericError;
    });

    it("should have a message", () => {
        expect(this.errorInstance.message).to.equal("Convertion failed for class \"Test\".");
    });

    it("should have a name", () => {
        expect(this.errorInstance.name).to.equal("CONVERTER_SERIALIZATION_ERROR");
    });

    it("should have a stack object", () => {
        expect(this.errorInstance.stack).to.equal(this.genericError.stack);
    });

});