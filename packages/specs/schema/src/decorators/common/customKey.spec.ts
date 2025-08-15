import {
  AnyOf,
  boolean,
  CustomKeys,
  Default,
  Deprecated,
  Description,
  Example,
  getJsonSchema,
  getSpec,
  number,
  OperationPath,
  Path,
  Property,
  Required,
  Returns,
  SpecTypes,
  string
} from "../../index.js";
import {CustomKey} from "./customKey.js";

describe("@CustomKey", () => {
  it("should declare customKey field", () => {
    // WHEN
    class Model {
      @CustomKey("range", [1, 2])
      num: number;
    }

    // THEN
    const schema = getJsonSchema(Model, {customKeys: true});

    expect(schema).toEqual({
      properties: {
        num: {
          type: "number",
          range: [1, 2]
        }
      },
      type: "object"
    });
  });

  it("should return the spec (OS3)", () => {
    // WHEN
    class Model {
      @CustomKey("range", [1, 2])
      num: number;
    }

    @Path("/")
    class MyController {
      @OperationPath("GET", "/")
      @Returns(200, Model)
      get() {}
    }

    // THEN
    const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      components: {
        schemas: {
          Model: {
            properties: {
              num: {
                type: "number"
              }
            },
            type: "object"
          }
        }
      },
      paths: {
        "/": {
          get: {
            operationId: "myControllerGet",
            parameters: [],
            responses: {
              "200": {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Model"
                    }
                  }
                },
                description: "Success"
              }
            },
            tags: ["MyController"]
          }
        }
      },
      tags: [
        {
          name: "MyController"
        }
      ]
    });
  });

  it("should declare customKey field (keys)", () => {
    // WHEN
    class Model {
      @CustomKeys({range: [1, 2]})
      num: number;
    }

    // THEN
    const schema = getJsonSchema(Model, {customKeys: true});

    expect(schema).toEqual({
      properties: {
        num: {
          type: "number",
          range: [1, 2]
        }
      },
      type: "object"
    });
  });

  it("should return the spec using anyOf (OS3)", () => {
    class Model {
      @Required()
      @Property(String)
      @Default("GET")
      @CustomKey("x-key", 0)
      public method: string;

      @CustomKey("x-key", 1)
      @AnyOf(string().default(""), number().default(0), boolean().default(false))
      @Description("The value can be a string, number, or boolean")
      @Deprecated()
      @Example("example string")
      public value?: string | number | boolean;
    }

    expect(getJsonSchema(Model, {customKeys: true})).toMatchInlineSnapshot(`
      {
        "properties": {
          "method": {
            "default": "GET",
            "minLength": 1,
            "type": "string",
            "x-key": 0,
          },
          "value": {
            "anyOf": [
              {
                "default": "",
                "type": "string",
              },
              {
                "default": 0,
                "type": "number",
              },
              {
                "default": false,
                "type": "boolean",
              },
            ],
            "deprecated": true,
            "description": "The value can be a string, number, or boolean",
            "examples": [
              "example string",
            ],
            "x-key": 1,
          },
        },
        "required": [
          "method",
        ],
        "type": "object",
      }
    `);
  });
});
