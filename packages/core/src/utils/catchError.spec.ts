import {catchError} from "./catchError";

describe("catchError", () => {
  it("should catch error", () => {
    expect(
      catchError(() => {
        throw new Error("message");
      })?.message
    ).toEqual("message");
  });
});
