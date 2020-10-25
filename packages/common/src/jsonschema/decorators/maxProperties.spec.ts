import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {MaxProperties} from "./maxProperties";

describe("MaxProperties", () => {
  it("should store data", () => {
    // WHEN
    class Model {
      @MaxProperties(10)
      prop: any;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        prop: {
          maxProperties: 10,
          type: "object"
        }
      },
      type: "object"
    });
  });
});
