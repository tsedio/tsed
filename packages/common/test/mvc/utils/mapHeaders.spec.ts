import {expect} from "chai";
import {mapHeaders} from "../../../src/mvc";

describe("mapHeaders", () => {
  it("should map headers", () => {
    expect(
      mapHeaders({
        header1: 1,
        header2: "content",
        header3: {
          value: "content2",
          type: "string"
        }
      })
    ).to.deep.eq({
      header1: {value: 1, type: "number"},
      header2: {value: "content", type: "string"},
      header3: {
        value: "content2",
        type: "string"
      }
    });
  });
});
