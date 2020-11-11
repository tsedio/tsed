import {expect} from "chai";
import {mapAllowedRequiredValues} from "./mapAllowedRequiredValues";

describe("mapAllowedRequiredValues", () => {
  it("should return allowedRequiredValues", () => {
    expect(
      mapAllowedRequiredValues("string", {
        minLength: undefined
      })
    ).to.deep.eq([""]);
    expect(
      mapAllowedRequiredValues("string", {
        minLength: 1
      })
    ).to.deep.eq([]);
    expect(mapAllowedRequiredValues("null", {})).to.deep.eq([null]);
    expect(
      mapAllowedRequiredValues("null", {
        oneOf: [
          {
            type: "null"
          }
        ]
      })
    ).to.deep.eq([null]);
    expect(
      mapAllowedRequiredValues("number", {
        minimum: 0
      })
    ).to.deep.eq([0]);
  });
});
