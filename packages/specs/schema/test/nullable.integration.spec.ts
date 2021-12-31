import {expect} from "chai";
import {Any, getJsonSchema, getSpec, Required, SpecTypes, string} from "../src";
import {Nullable, OperationPath, Path, Property, Returns} from "../src/decorators";
import {validateSpec} from "./helpers/validateSpec";

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
  async get() {
  }
}

describe("Spec: Nullable", () => {
  it("should generate the JSON", () => {
    const schema = getJsonSchema(Product);
    expect(schema).to.deep.eq({
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
        id: {
          type: "string"
        },
        price: {
          type: ["null", "number"]
        },
        priceDetails: {
          type: ["null", "string", "number"]
        },
        description: {
          "minLength": 1,
          type: ["null", "string"]
        },
        "nested": {
          "oneOf": [
            {
              "type": "null"
            },
            {
              "$ref": "#/definitions/Nested"
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

    expect(spec).to.deep.eq({
      components: {
        schemas: {
          "Nested": {
            "properties": {
              "id": {
                "type": "string"
              }
            },
            "type": "object"
          },
          Product: {
            properties: {
              id: {
                type: "string"
              },
              price: {
                type: "number",
                nullable: true
              },
              priceDetails: {
                nullable: true,
                oneOf: [
                  {
                    type: "string"
                  },
                  {
                    type: "number"
                  }
                ]
              },
              description: {
                type: "string",
                minLength: 1,
                nullable: true
              },
              nested: {
                oneOf: [
                  {
                    $ref: "#/components/schemas/Nested"
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
    expect(await validateSpec(spec, SpecTypes.OPENAPI)).to.eq(true);
  });
  it("should generate the OS2", async () => {
    const spec = getSpec(TestNullableCtrl, {specType: SpecTypes.SWAGGER});

//    expect(await validateSpec(spec)).to.eq(true);
    expect(spec).to.deep.eq({
      definitions: {
        Nested: {
          "properties": {
            "id": {
              "type": "string"
            }
          },
          type: "object"
        },
        Product: {
          properties: {
            id: {
              type: "string"
            },
            price: {
              type: ["null", "number"]
            },
            priceDetails: {
              type: ["null", "string", "number"]
            },
            nested: {
              "$ref": "#/definitions/Nested"
            },
            description: {
              type: [
                "null",
                "string"
              ],
              minLength: 1
            }
          },
          required: ["description", "nested"],
          type: "object"
        }
      },
      paths: {
        "/nullable": {
          get: {
            operationId: "testNullableCtrlGet",
            parameters: [],
            produces: ["application/json"],
            responses: {
              "200": {
                description: "Success",
                schema: {
                  $ref: "#/definitions/Product"
                }
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
  });
});
