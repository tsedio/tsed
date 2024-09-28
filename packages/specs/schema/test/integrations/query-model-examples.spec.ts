import {QueryParams} from "@tsed/platform-params";

import {
  Default,
  Examples,
  GenericOf,
  Generics,
  getSpec,
  In,
  Maximum,
  Minimum,
  OperationPath,
  Path,
  Property,
  SpecTypes
} from "../../src/index.js";

class QueryParamModel {
  @Property()
  path: string;

  @Property()
  condition: string;

  @Property()
  value: string;
}

@Path("/query")
class QueryModelCtrl {
  @OperationPath("GET", "/")
  async get(
    @QueryParams()
    @Examples({
      example1: {
        description: "description1",
        value: {
          path: "path1",
          condition: "condition1"
        }
      },
      example2: {
        description: "description1",
        value: {
          path: "path2",
          condition: "condition2"
        }
      }
    })
    q: QueryParamModel
  ) {}
}

describe("Query Model example", () => {
  it("should generate the spec for deep object", () => {
    const spec = getSpec(QueryModelCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      paths: {
        "/query": {
          get: {
            operationId: "queryModelCtrlGet",
            parameters: [
              {
                in: "query",
                name: "path",
                required: false,
                examples: {
                  example1: {
                    description: "description1",
                    value: "path1"
                  },
                  example2: {
                    description: "description1",
                    value: "path2"
                  }
                },
                schema: {
                  type: "string"
                }
              },
              {
                examples: {
                  example1: {
                    description: "description1",
                    value: "condition1"
                  },
                  example2: {
                    description: "description1",
                    value: "condition2"
                  }
                },
                in: "query",
                name: "condition",
                required: false,
                schema: {
                  type: "string"
                }
              },
              {
                in: "query",
                name: "value",
                required: false,
                schema: {
                  type: "string"
                }
              }
            ],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["QueryModelCtrl"]
          }
        }
      },
      tags: [
        {
          name: "QueryModelCtrl"
        }
      ]
    });
  });
});
