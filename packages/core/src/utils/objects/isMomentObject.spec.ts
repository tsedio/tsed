import {isMomentObject} from "./isMomentObject.js";

describe("isMomentObject", () => {
  it("should return true if object is moment object", () => {
    expect(
      isMomentObject({
        _isAMomentObject: true
      })
    ).toEqual(true);
  });

  it("should return false if object is not moment object", () => {
    expect(isMomentObject({})).toEqual(false);
    expect(isMomentObject(null)).toEqual(false);
  });
});
