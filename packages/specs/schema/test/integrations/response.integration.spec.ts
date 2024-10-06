import {QueryParams} from "@tsed/platform-params";

import {getSpec, OperationPath, Path, Property, Returns, SpecTypes} from "../../src/index.js";
import {validateSpec} from "../helpers/validateSpec.js";

class Product {
  @Property()
  id: string;

  @Property()
  title: string;

  constructor({id, title}: Partial<Product> = {}) {
    id && (this.id = id);
    title && (this.title = title);
  }
}

@Path("/responses")
class TestResponseCtrl {
  @OperationPath("GET", "/:id")
  @(Returns(200, Product).Description("Product"))
  async scenario1(@QueryParams("id") id: string) {}

  @OperationPath("POST", "/")
  @Returns(204)
  async scenario2() {}
}

describe("Spec: Response", () => {
  it("should generate the", async () => {
    const spec = getSpec(TestResponseCtrl);

    expect(spec).toEqual({
      components: {
        schemas: {
          Product: {
            properties: {
              id: {
                type: "string"
              },
              title: {
                type: "string"
              }
            },
            type: "object"
          }
        }
      },
      paths: {
        "/responses": {
          post: {
            operationId: "testResponseCtrlScenario2",
            parameters: [],
            responses: {
              "204": {
                description: "No Content"
              }
            },
            tags: ["TestResponseCtrl"]
          }
        },
        "/responses/{id}": {
          get: {
            operationId: "testResponseCtrlScenario1",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: {
                  type: "string"
                }
              },
              {
                in: "query",
                name: "id",
                required: false,
                schema: {
                  type: "string"
                }
              }
            ],
            responses: {
              "200": {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Product"
                    }
                  }
                },
                description: "Product"
              }
            },
            tags: ["TestResponseCtrl"]
          }
        }
      },
      tags: [
        {
          name: "TestResponseCtrl"
        }
      ]
    });
    expect(await validateSpec(spec, SpecTypes.OPENAPI)).toBe(true);
  });
});
