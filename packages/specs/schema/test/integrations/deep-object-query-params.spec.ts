import {QueryParams} from "@tsed/platform-params";

import {Default, GenericOf, Generics, getSpec, In, Maximum, Minimum, OperationPath, Path, Property, SpecTypes} from "../../src/index.js";

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
  it("should generate the spec for deep with generics", () => {
    class FindQuery {
      @Property()
      tableColumnNameA?: number;

      @Property()
      tableColumnNameB?: number;
    }

    @Generics("T")
    class PaginationQuery<T> {
      // things about pagination
      @Minimum(0)
      @Default(0)
      offset?: number;

      @Minimum(1)
      @Maximum(1000)
      @Default(50)
      limit?: number;

      @Property("T")
      where?: T;
    }

    @Path("/pageable")
    class TestDeepObjectCtrl {
      @OperationPath("GET", "/")
      async get(@QueryParams("s") @GenericOf(FindQuery) q: PaginationQuery<FindQuery>) {}
    }

    const spec = getSpec(TestDeepObjectCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      components: {
        schemas: {
          FindQuery: {
            properties: {
              tableColumnNameA: {
                type: "number"
              },
              tableColumnNameB: {
                type: "number"
              }
            },
            type: "object"
          },
          PaginationQuery: {
            properties: {
              limit: {
                default: 50,
                maximum: 1000,
                minimum: 1,
                type: "number"
              },
              offset: {
                default: 0,
                minimum: 0,
                type: "number"
              },
              where: {
                $ref: "#/components/schemas/FindQuery"
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
                schema: {
                  $ref: "#/components/schemas/PaginationQuery"
                },
                style: "deepObject"
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
  it("should generate the spec for deep with generics without expression", () => {
    class FindQuery {
      @Property()
      tableColumnNameA?: number;

      @Property()
      tableColumnNameB?: number;
    }

    @Generics("T")
    class PaginationQuery<T> {
      // things about pagination
      @Minimum(0)
      @Default(0)
      offset?: number;

      @Minimum(1)
      @Maximum(1000)
      @Default(50)
      limit?: number;

      @Property("T")
      where?: T;
    }

    @Path("/pageable")
    class TestDeepObjectCtrl {
      @OperationPath("GET", "/")
      async get(@In("query") @GenericOf(FindQuery) q: PaginationQuery<FindQuery>) {}
    }

    const spec = getSpec(TestDeepObjectCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      components: {
        schemas: {
          FindQuery: {
            properties: {
              tableColumnNameA: {
                type: "number"
              },
              tableColumnNameB: {
                type: "number"
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
                name: "offset",
                required: false,
                schema: {
                  default: 0,
                  minimum: 0,
                  type: "number"
                }
              },
              {
                in: "query",
                name: "limit",
                required: false,
                schema: {
                  default: 50,
                  maximum: 1000,
                  minimum: 1,
                  type: "number"
                }
              },
              {
                in: "query",
                name: "where",
                required: false,
                style: "deepObject",
                schema: {
                  $ref: "#/components/schemas/FindQuery"
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
