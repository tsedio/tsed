import {withErrorMsg} from "./withErrorMsg.js";

// TODO: complete this test
describe("withErrorMsg", () => {
  it("should return a function when called", () => {
    const result = withErrorMsg("test", () => {});
    expect(result).toBeInstanceOf(Function);
  });

  it("should return an ErrorChainedMethods object when the returned function is called", () => {
    const result = withErrorMsg("test", () => {})();
    expect(result).toBeInstanceOf(Object);
    expect(result).toHaveProperty("Error");
    expect(result.Error).toBeInstanceOf(Function);
  });
});
