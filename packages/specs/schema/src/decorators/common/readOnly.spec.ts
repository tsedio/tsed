import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {ReadOnly} from "./readOnly";

describe("@ReadOnly", () => {
  it("should declare readOnly field", () => {
    // WHEN
    class Model {
      @ReadOnly(true)
      num: string;
    }

    // THEN
    const schema = getJsonSchema(Model);

    expect(schema).to.deep.equal({
      properties: {
        num: {
          readOnly: true,
          type: "string"
        }
      },
      type: "object"
    });
  });
});
