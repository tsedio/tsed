import {expect} from "chai";
import {UnknowFilterError} from "../../../src/mvc";

describe("UnknowFilterError", () => {
  before(() => {
    this.errorInstance = new UnknowFilterError(class Target {});
  });

  after(() => {
    delete this.errorInstance;
  });

  it("should have a message", () => {
    expect(this.errorInstance.message).to.equal("Filter Target not found.");
  });

  it("should have a name", () => {
    expect(this.errorInstance.name).to.equal("INTERNAL_SERVER_ERROR");
  });
});
