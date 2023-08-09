import {getRandomId} from "./getRandomId";

describe("getRandomId", () => {
  it("should return random id", () => {
    expect(getRandomId()).not.toEqual(getRandomId());
  });
});
