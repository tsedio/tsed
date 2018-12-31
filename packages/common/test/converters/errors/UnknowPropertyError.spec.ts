import {expect} from "chai";
import {UnknowPropertyError} from "../../../src/converters/errors/UnknowPropertyError";

describe("UnknowPropertyError", () => {
  before(() => {
    this.errorInstance = new UnknowPropertyError(class Test {
    }, "propertyKey");
  });

  after(() => {
    delete this.errorInstance;
  });

  it("should have a message", () => {
    expect(this.errorInstance.message).to.equal("Property propertyKey on class Test is not allowed.");
  });

  it("should have a name", () => {
    expect(this.errorInstance.name).to.equal("BAD_REQUEST");
  });
});
