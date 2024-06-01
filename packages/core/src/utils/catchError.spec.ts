import {catchAsyncError, catchError} from "./catchError.js";

describe("catchError", () => {
  it("should catch error", () => {
    expect(
      catchError(() => {
        throw new Error("message");
      })?.message
    ).toEqual("message");
  });
});

describe("catchAsyncError", () => {
  it("should catch error", async () => {
    expect((await catchAsyncError(() => Promise.reject(new Error("message"))))?.message).toEqual("message");
  });
});
