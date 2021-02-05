import {expect} from "chai";
import {Any, getJsonSchema, getSpec, SpecTypes, string} from "../src";
import {OperationPath, Path, Property, Returns} from "../src/decorators";
import {validateSpec} from "./helpers/validateSpec";

class Product {
  @Property()
  id: string;

  @Any(Number, null)
  price: number | null;

  @Any(String, Number, null)
  priceDetails: string | number | null;
  
  update
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
    expect(schema).to.deep.eq({
      properties: {
        id: {
          type: "string"
        },
        price: {
          type: ["number", "null"]
        },
        priceDetails: {
          type: ["string", "number", "null"]
        }
      },
      type: "object"
    });
  });
  it("should generate the OS3", async () => {
    const spec = getSpec(TestNullableCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).to.deep.eq({
      components: {
        schemas: {
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
                oneOf: [
                  {
                    nullable: true,
                    type: "string"
                  },
                  {
                    nullable: true,
                    type: "number"
                  }
                ]
              }
            },
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

    expect(await validateSpec(spec)).to.eq(true);
    expect(spec).to.deep.eq({
      definitions: {
        Product: {
          properties: {
            id: {
              type: "string"
            },
            price: {
              type: ["number", "null"]
            },
            priceDetails: {
              type: ["string", "number", "null"]
            }
          },
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
