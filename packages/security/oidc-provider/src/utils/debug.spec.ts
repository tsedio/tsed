import {debug} from "./debug";

describe("debug", () => {
  it("should debug", () => {
    expect(
      debug({
        value: undefined,
        test: "1"
      })
    ).toEqual("<strong>test</strong>: '1'");
  });
});
