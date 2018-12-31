import {expect} from "chai";
import {UnknowMiddlewareError} from "../../../src/mvc";

describe("UnknowMiddlewareError", () => {
  before(() => {
    this.errorInstance = new UnknowMiddlewareError(class Target {});
  });

  after(() => {
    delete this.errorInstance;
  });

  it("should have a message", () => {
    expect(this.errorInstance.message).to.equal("Middleware Target not found.");
  });

  it("should have a name", () => {
    expect(this.errorInstance.name).to.equal("INTERNAL_SERVER_ERROR");
  });
});
