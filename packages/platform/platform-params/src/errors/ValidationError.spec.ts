import {ValidationError} from "./ValidationError.js";

describe("ValidationError", () => {
  it("should return error", () => {
    const error = new ValidationError("should have required property", [
      {
        dataPath: "hello"
      }
    ]);

    expect(error.errors).toEqual([
      {
        dataPath: "hello"
      }
    ]);
    expect(error.message).toEqual("should have required property");
  });
});
