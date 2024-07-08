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
          anyOf: [
            {
              type: "null"
            },
            {
              multipleOf: 1,
              type: "integer"
            },
            {
              type: "number"
            },
            {
              type: "string"
            },
            {
              type: "boolean"
            },
            {
              type: "array"
            },
            {
              type: "object"
            }
          ]
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
          anyOf: [
            {
              type: "null"
            },
            {
              type: "string"
            },
            {
              type: "number"
            },
            {
              type: "boolean"
            }
          ]
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
          anyOf: [
            {
              type: "null"
            },
            {
              type: "string"
            }
          ]
        }
      },
      type: "object"
    });
  });
});
