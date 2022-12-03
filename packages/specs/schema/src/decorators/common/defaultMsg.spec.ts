import {getJsonSchema} from "../../utils/getJsonSchema";
import {DefaultMsg} from "./defaultMsg";

describe("@DefaultMsg", () => {
  it("should declare default message", () => {
    // WHEN
    @DefaultMsg("foo should be a string")
    class Model {
      property: number;
    }

    // THEN
    const schema = getJsonSchema(Model, {customKeys: true});

    expect(schema).toEqual({
      type: "object",
      errorMessage: {
        _: "foo should be a string"
      }
    });
  });
});
