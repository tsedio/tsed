import {expect} from "chai";
import {ConverterSerializationError} from "./ConverterSerializationError";

describe("ConverterSerializationError", () => {
  it("should return error", () => {
    const genericError = new Error("test");
    const errorInstance = new ConverterSerializationError(class Test {}, genericError);

    expect(errorInstance.name).to.equal("CONVERTER_SERIALIZATION_ERROR");
    expect(errorInstance.message).to.equal("Conversion failed for \"Test\". test");
    expect(errorInstance.stack).to.equal(genericError.stack);
  });
});
