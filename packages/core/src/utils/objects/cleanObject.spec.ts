import {cleanObject} from "./cleanObject.js";

describe("cleanObject", () => {
  it("should clean undefined value from object", () => {
    expect(
      cleanObject(
        {
          test: undefined,
          test2: false,
          test3: null,
          test4: "",
          ignored: "key"
        },
        ["ignored"]
      )
    ).toEqual({
      test2: false,
      test3: null,
      test4: ""
    });
  });
});
