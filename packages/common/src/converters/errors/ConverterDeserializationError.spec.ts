import {expect} from "chai";
import {ConverterDeserializationError} from "./ConverterDeserializationError";

describe("ConverterDeserializationError", () => {
  it("should return error", () => {
    const genericError = new Error("test");
    const errorInstance = new ConverterDeserializationError(class Test {}, {}, genericError);

    expect(errorInstance.message).to.equal("Conversion failed for class \"Test\" with object => {}.\ntest");
    expect(errorInstance.name).to.equal("CONVERTER_DESERIALIZATION_ERROR");
    expect(errorInstance.stack).to.equal(genericError.stack);
  });
});
