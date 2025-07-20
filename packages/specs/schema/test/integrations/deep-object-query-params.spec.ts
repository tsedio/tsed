import {QueryParams} from "@tsed/platform-params";

import {getSpec, OperationPath, Path, Property, SpecTypes} from "../../src/index.js";

describe("Deep Object QueryParams", () => {
  it("should generate the spec for deep object", () => {
    class DeepQueryObject {
      @Property()
      path: string;

      @Property()
      condition: string;

      @Property()
      value: string;
    }

    @Path("/pageable")
    class TestDeepObjectCtrl {
      @OperationPath("GET", "/")
      async get(@QueryParams("s") q: DeepQueryObject) {}
    }

    const spec = getSpec(TestDeepObjectCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      components: {
        schemas: {
          DeepQueryObject: {
            properties: {
              condition: {
                type: "string"
              },
              path: {
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            type: "object"
          }
        }
      },
      paths: {
        "/pageable": {
          get: {
            operationId: "testDeepObjectCtrlGet",
            parameters: [
              {
                in: "query",
                name: "s",
                required: false,
                style: "deepObject",
                schema: {
                  $ref: "#/components/schemas/DeepQueryObject"
                }
              }
            ],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["TestDeepObjectCtrl"]
          }
        }
      },
      tags: [
        {
          name: "TestDeepObjectCtrl"
        }
      ]
    });
  });
});
