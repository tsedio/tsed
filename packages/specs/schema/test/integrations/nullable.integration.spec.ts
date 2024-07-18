import {Any, getJsonSchema, getSpec, Nullable, OperationPath, Path, Property, Required, Returns, SpecTypes} from "../../src/index.js";
import {validateSpec} from "../helpers/validateSpec.js";

class Nested {
  @Property()
  id: string;
}

class Product {
  @Property()
  id: string;

  @Any(Number, null)
  price: number | null;

  @Any(String, Number, null)
  priceDetails: string | number | null;

  @Required(true, null)
  @Nullable(String)
  description: string | null;

  @Required(true, null)
  @Nullable(Nested)
  nested: Nested | null;
}

@Path("/nullable")
class TestNullableCtrl {
  @OperationPath("GET", "/")
  @Returns(200, Product)
  async get() {}
}

describe("Spec: Nullable", () => {
  it("should generate the JSON", () => {
    const schema = getJsonSchema(Product);
    expect(schema).toEqual({
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
        description: {
          minLength: 1,
          type: ["null", "string"]
        },
        id: {
          type: "string"
        },
        nested: {
          anyOf: [
            {
              type: "null"
            },
            {
              $ref: "#/definitions/Nested"
            }
          ]
        },
        price: {
          type: ["null", "number"]
        },
        priceDetails: {
          anyOf: [
            {
              type: "null"
            },
            {
              type: "string"
            },
            {
              type: "number"
            }
          ]
        }
      },
      required: ["description", "nested"],
      type: "object"
    });
  });
  it("should generate the OS3", async () => {
    const spec = getSpec(TestNullableCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      components: {
        schemas: {
          Nested: {
            properties: {
              id: {
                type: "string"
              }
            },
            type: "object"
          },
          Product: {
            properties: {
              description: {
                minLength: 1,
                nullable: true,
                type: "string"
              },
              id: {
                type: "string"
              },
              nested: {
                anyOf: [
                  {
                    $ref: "#/components/schemas/Nested"
                  }
                ],
                nullable: true
              },
              price: {
                nullable: true,
                type: "number"
              },
              priceDetails: {
                anyOf: [
                  {
                    type: "string"
                  },
                  {
                    type: "number"
                  }
                ],
                nullable: true
              }
            },
            required: ["description", "nested"],
            type: "object"
          }
        }
      },
      paths: {
        "/nullable": {
          get: {
            operationId: "testNullableCtrlGet",
            parameters: [],
            responses: {
              "200": {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Product"
                    }
                  }
                },
                description: "Success"
              }
            },
            tags: ["TestNullableCtrl"]
          }
        }
      },
      tags: [
        {
          name: "TestNullableCtrl"
        }
      ]
    });
    expect(await validateSpec(spec, SpecTypes.OPENAPI)).toBe(true);
  });
});
