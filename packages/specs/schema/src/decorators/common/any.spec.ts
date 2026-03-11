import {OnDeserialize} from "@tsed/json-mapper";

import {Default, getJsonSchema, MinLength, Property} from "../../index.js";
import {Any} from "./any.js";

describe("@Any", () => {
  it("should declare any prop", () => {
    // WHEN
    class Model {
      @Any()
      prop: any;
    }

    // THEN
    expect(getJsonSchema(Model)).toMatchInlineSnapshot(`
      {
        "properties": {
          "prop": {
            "oneOf": [
              {
                "type": "null",
              },
              {
                "multipleOf": 1,
                "type": "integer",
              },
              {
                "type": "number",
              },
              {
                "type": "string",
              },
              {
                "type": "boolean",
              },
              {
                "items": {},
                "type": "array",
              },
              {
                "type": "object",
              },
            ],
          },
        },
        "type": "object",
      }
    `);
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
          oneOf: [
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
          type: ["null", "string"]
        }
      },
      type: "object"
    });
  });
  it("should deduplicate duplicated types", () => {
    // WHEN
    class Model {
      @Any(String, String)
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
  it("should declare any prop with primitive and model", () => {
    // WHEN
    class Nested {
      @Property()
      id: string;
    }

    class Model {
      @Any(String, Nested)
      prop: any;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      definitions: {
        Nested: {
          properties: {
            id: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        prop: {
          oneOf: [
            {
              type: "string"
            },
            {
              $ref: "#/definitions/Nested"
            }
          ]
        }
      },
      type: "object"
    });
  });
  it("should return the json schema for an inherited model", () => {
    class Root {
      @OnDeserialize((o) => !!o)
      @Any(String, Boolean)
      @Default(false)
      another: boolean;
    }

    class Base extends Root {
      @Property()
      id: string;
    }

    class Model extends Base {
      @MinLength(0)
      declare email: string;
    }

    expect(getJsonSchema(Model)).toEqual({
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        email: {
          type: "string",
          minLength: 0
        },
        another: {
          default: false,
          oneOf: [
            {
              type: "string"
            },
            {
              type: "boolean"
            }
          ]
        }
      }
    });
  });
});
