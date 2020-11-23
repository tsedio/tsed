import {expect} from "chai";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {number, string} from "../../utils/from";
import {AnyOf} from "./anyOf";

describe("@AnyOf", () => {
  it("should declare return schema", () => {
    // WHEN
    class Model {
      @AnyOf(string(), number())
      num: string;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
      properties: {
        num: {
          anyOf: [
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
