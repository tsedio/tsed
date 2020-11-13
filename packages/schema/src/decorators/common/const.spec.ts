import {SpecTypes} from "@tsed/schema";
import {expect} from "chai";
import {getJsonSchema} from "../../utils/getJsonSchema";
import {Const} from "./const";

describe("@Const", () => {
  it("should declare prop", () => {
    // WHEN
    class Model {
      @Const("10")
      num: string = "10";
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        num: {
          const: "10",
          type: "string"
        }
      },
      type: "object"
    });

    expect(getJsonSchema(Model, {specType: SpecTypes.OPENAPI})).to.deep.equal({
      properties: {
        num: {
          type: "string"
        }
      },
      type: "object"
    });
  });
});
