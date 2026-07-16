import {Default} from "./default.js";
import {s} from "../../fn/index.js";

describe("@Default", () => {
  it("should declare prop", () => {
    // WHEN
    class Model {
      @Default("10")
      num: string = "10";

      constructor() {}
    }

    // THEN
    expect(s.compile(Model)).toEqual({
      properties: {
        num: {
          default: "10",
          type: "string"
        }
      },
      type: "object"
    });
  });
  it("should declare prop (Date.now)", () => {
    // WHEN
    class Model {
      @Default(Date.now)
      num: Date = new Date();

      constructor() {}
    }

    // THEN
    expect(s.compile(Model)).toEqual({
      properties: {
        num: {
          default: expect.any(Number),
          type: "string"
        }
      },
      type: "object"
    });
  });
});
