import {ValidationError} from "@tsed/common";
import {expect} from "chai";

describe("ValidationError", () => {
  it("should return error", () => {
    const error = new ValidationError("should have required property", [
      {
        dataPath: "hello"
      }
    ]);

    expect(error.errors).to.deep.eq([
      {
        dataPath: "hello"
      }
    ]);
    expect(error.message).to.eq("should have required property");
  });
});
