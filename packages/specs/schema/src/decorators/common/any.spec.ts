import {getJsonSchema} from "../../utils/getJsonSchema.js";
import {Any} from "./any.js";

describe("@Any", () => {
  it("should declare any prop", () => {
    // WHEN
    class Model {
      @Any()
      prop: any;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop: {
          type: ["null", "integer", "number", "string", "boolean", "array", "object"]
        }
      },
      type: "object"
    });
  });
  it("should declare any prop (uniq type)", () => {
    // WHEN
    class Model {
      @Any(String)
      prop: any;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop: {
          type: "string"
        }
      },
      type: "object"
    });
  });
  it("should declare any prop (with list)", () => {
    // WHEN
    class Model {
      @Any(String, Number, Boolean, null)
      prop: any;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop: {
          type: ["null", "string", "number", "boolean"]
        }
      },
      type: "object"
    });
  });
  it("should declare any prop (with string, list)", () => {
    // WHEN
    class Model {
      @Any("string", "null")
      prop: any;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop: {
          type: ["null", "string"]
        }
      },
      type: "object"
    });
  });
});
