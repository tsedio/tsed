import {compile, Title} from "../../index.js";

describe("Title()", () => {
  it("should store data", () => {
    class Test {
      @Title("Title")
      test: string;
    }

    expect(compile(Test)).toEqual({
      properties: {
        test: {
          title: "Title",
          type: "string"
        }
      },
      type: "object"
    });
  });
});
