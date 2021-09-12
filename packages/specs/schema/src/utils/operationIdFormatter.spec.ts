import {expect} from "chai";
import {operationIdFormatter} from "./operationIdFormatter";

describe("operationIdFormatter", () => {
  it("should define new OperationId", () => {
    const formatter = operationIdFormatter();

    expect(formatter("Test", "test")).to.eq("testTest");
    expect(formatter("Test", "test")).to.eq("testTest_1");
    expect(formatter("Test", "test", "/path/{id}")).to.eq("testTestById");
  });
});
