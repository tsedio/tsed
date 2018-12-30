import {expect} from "chai";
import {ConverterDeserializationError} from "../../../src/converters/errors/ConverterDeserializationError";

describe("ConverterDeserializationError", () => {
  before(() => {
    this.genericError = new Error("test");
    this.errorInstance = new ConverterDeserializationError(class Test {
    }, {}, this.genericError);
  });

  after(() => {
    delete this.errorInstance;
    delete this.genericError;
  });

  it("should have a message", () => {
    expect(this.errorInstance.message).to.equal("Conversion failed for class \"Test\" with object => {}.\ntest");
  });

  it("should have a name", () => {
    expect(this.errorInstance.name).to.equal("CONVERTER_DESERIALIZATION_ERROR");
  });

  it("should have a stack object", () => {
    expect(this.errorInstance.stack).to.equal(this.genericError.stack);
  });
});
