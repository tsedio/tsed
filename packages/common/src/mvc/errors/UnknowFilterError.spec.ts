import {expect} from "chai";
import {UnknowFilterError} from "../../../src/mvc";

describe("UnknowFilterError", () => {
  it("should have a message", () => {
    const errorInstance = new UnknowFilterError(class Target {});
    expect(errorInstance.message).to.equal("Filter Target not found.");
    expect(errorInstance.name).to.equal("INTERNAL_SERVER_ERROR");
  });
});
