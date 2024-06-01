import {getJsonSchema} from "../../utils/getJsonSchema.js";
import {ErrorMsg} from "./errorMsg.js";

describe("@ErrorMsg", () => {
  it("should declare error message", () => {
    // WHEN
    class Model {
      @ErrorMsg({property: "foo should be a string"})
      property: number;
    }

    // THEN
    const schema = getJsonSchema(Model, {customKeys: true});

    expect(schema).toEqual({
      type: "object",
      properties: {
        property: {
          type: "number"
        }
      },
      errorMessage: {
        property: "foo should be a string"
      }
    });
  });

  it("should declare multiple error messages", () => {
    // WHEN
    class Model {
      @ErrorMsg({foo: "foo should be a string"})
      foo: string;

      @ErrorMsg({bar: "bar should be a number"})
      bar: number;
    }

    // THEN
    const schema = getJsonSchema(Model, {customKeys: true});

    expect(schema).toEqual({
      type: "object",
      properties: {
        foo: {
          type: "string"
        },
        bar: {
          type: "number"
        }
      },
      errorMessage: {
        foo: "foo should be a string",
        bar: "bar should be a number"
      }
    });
  });
});
