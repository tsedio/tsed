import {chain} from "./chain.js";

describe("chain()", () => {
  it("should call onValue in the same tick for a plain value", () => {
    const onValue = vi.fn().mockReturnValue("result");

    const result = chain("value", onValue);

    expect(onValue).toHaveBeenCalledWith("value");
    expect(result).toEqual("result");
  });

  it("should call onValue once a promise resolves", async () => {
    const onValue = vi.fn().mockReturnValue("result");

    const result = chain(Promise.resolve("value"), onValue);

    expect(onValue).not.toHaveBeenCalled();
    expect(result).toBeInstanceOf(Promise);
    expect(await result).toEqual("result");
    expect(onValue).toHaveBeenCalledWith("value");
  });

  it("should call onError when the promise rejects", async () => {
    const error = new Error("rejected");
    const onValue = vi.fn();
    const onError = vi.fn().mockReturnValue("handled");

    const result = await chain(Promise.reject(error), onValue, onError);

    expect(result).toEqual("handled");
    expect(onError).toHaveBeenCalledWith(error);
    expect(onValue).not.toHaveBeenCalled();
  });

  it("should keep the rejection when no onError is given", async () => {
    const error = new Error("rejected");

    await expect(chain(Promise.reject(error), vi.fn())).rejects.toBe(error);
  });
});
