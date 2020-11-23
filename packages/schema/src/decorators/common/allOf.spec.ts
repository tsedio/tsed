import {expect} from "chai";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {number, string} from "../../utils/from";
import {AllOf} from "./allOf";

describe("@AllOf", () => {
  it("should declare return schema", () => {
    // WHEN
    class Model {
      @AllOf(string(), number())
      num: string;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
      properties: {
        num: {
          allOf: [
            {
              type: "string"
            },
            {
              type: "number"
            }
          ]
        }
      },
      type: "object"
    });
  });
});
