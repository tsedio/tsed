import {expect} from "chai";
import {UnknownFilterError} from "./UnknownFilterError";

describe("UnknownFilterError", () => {
  it("should have a message", () => {
    const errorInstance = new UnknownFilterError(class Target {});
    expect(errorInstance.message).to.equal("Filter Target not found.");
    expect(errorInstance.name).to.equal("INTERNAL_SERVER_ERROR");
  });
});
