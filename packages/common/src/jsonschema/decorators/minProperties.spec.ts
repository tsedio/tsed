import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {MinProperties} from "./minProperties";

describe("MinProperties", () => {
  it("should store data", () => {
    // WHEN
    class Model {
      @MinProperties(10)
      prop: any;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        prop: {
          minProperties: 10,
          type: "object"
        }
      },
      type: "object"
    });
  });
});
