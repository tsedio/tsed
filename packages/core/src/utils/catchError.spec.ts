import {catchAsyncError, catchError} from "./catchError";

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
    expect(
      (
        await catchAsyncError(async () => {
          throw new Error("message");
        })
      )?.message
    ).toEqual("message");
  });
});
