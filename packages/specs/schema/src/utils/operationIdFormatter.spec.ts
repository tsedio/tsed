import {operationIdFormatter} from "./operationIdFormatter";

describe("operationIdFormatter", () => {
  it("should define new OperationId", () => {
    const formatter = operationIdFormatter();

    expect(formatter("Test", "test")).toBe("testTest");
    expect(formatter("Test", "test")).toBe("testTest_1");
    expect(formatter("Test", "test", "/path/{id}")).toBe("testTestById");
  });
});
