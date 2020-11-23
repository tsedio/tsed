import {OneOf} from "@tsed/schema";
import {expect} from "chai";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {number, string} from "../../utils/from";

describe("@OneOf", () => {
  it("should declare return schema", () => {
    // WHEN
    class Model {
      @OneOf(string(), number())
      num: string;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
      properties: {
        num: {
          oneOf: [
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
