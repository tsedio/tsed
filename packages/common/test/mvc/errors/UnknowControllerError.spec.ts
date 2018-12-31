import {expect} from "chai";
import {UnknowControllerError} from "../../../src/mvc";

describe("UnknowControllerError", () => {
  before(() => {
    this.errorInstance = new UnknowControllerError(class Target {
    });
  });

  after(() => {
    delete this.errorInstance;
  });

  it("should have a message", () => {
    expect(this.errorInstance.message).to.equal("Controller Target not found.");
  });

  it("should have a name", () => {
    expect(this.errorInstance.name).to.equal("INTERNAL_SERVER_ERROR");
  });
});
