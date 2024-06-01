import {getRandomId} from "./getRandomId.js";

describe("getRandomId", () => {
  it("should return random id", () => {
    expect(getRandomId()).not.toEqual(getRandomId());
  });
});
