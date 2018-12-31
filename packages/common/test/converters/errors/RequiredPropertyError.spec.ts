import {expect} from "chai";
import {RequiredPropertyError} from "../../../src/converters/errors/RequiredPropertyError";

describe("RequiredPropertyError", () => {
  before(() => {
    this.errorInstance = new RequiredPropertyError(class Test {
    }, "propertyKey");
  });

  after(() => {
    delete this.errorInstance;
  });

  it("should have a message", () => {
    expect(this.errorInstance.message).to.equal("Property propertyKey on class Test is required.");
  });

  it("should have a name", () => {
    expect(this.errorInstance.name).to.equal("BAD_REQUEST");
  });
});
