import {Description, getJsonSchema} from "@tsed/common";
import {expect} from "chai";

describe("Description", () => {
  it("should return the right json schema", () => {
    // WHEN
    class Model {
      @Description("Description")
      prop: string;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      definitions: {},
      properties: {
        prop: {
          type: "string",
          description: "Description"
        }
      },
      type: "object"
    });
  });
});
