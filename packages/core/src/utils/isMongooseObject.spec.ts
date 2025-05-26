import {isMongooseObject} from "./isMongooseObject.js";

describe("isMongooseObject", () => {
  it("should return true if object is mongoose object", () => {
    expect(
      isMongooseObject({
        toJSON: () => {},
        $isMongooseModelPrototype: true
      })
    ).toEqual(true);
    expect(isMongooseObject({_bsontype: true})).toEqual(true);
  });
  it("should return false if object is not mongoose object", () => {
    expect(
      isMongooseObject({
        toJSON: () => {}
      })
    ).toEqual(false);
    expect(isMongooseObject({})).toEqual(false);
    expect(isMongooseObject(null)).toEqual(false);
  });
});
