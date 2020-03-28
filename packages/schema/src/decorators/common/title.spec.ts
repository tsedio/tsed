import {getJsonSchema, Title} from "@tsed/schema";
import {expect} from "chai";

describe("Title()", () => {
  it("should store data", () => {
    class Test {
      @Title("Title")
      test: string;
    }

    expect(getJsonSchema(Test)).to.deep.equal({
      "properties": {
        "test": {
          "title": "Title",
          "type": "string"
        }
      },
      "type": "object"
    });
  });
});
