import {expect} from "chai";
import {debug} from "./debug";

describe("debug", () => {
  it("should debug", () => {
    expect(
      debug({
        value: undefined,
        test: "1"
      })
    ).to.eq("<strong>test</strong>: '1'");
  });
});
