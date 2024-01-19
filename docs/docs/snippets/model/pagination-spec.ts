import {PlatformTest} from "@tsed/common";
import {getSpec, SpecTypes} from "@tsed/schema";
import * as qs from "querystring";
import * as SuperTest from "supertest";
import {PaginationFilter} from "../filters/PaginationFilter";
import {ProductsCtrl} from "./ProductsCtrl";
import {Server} from "./app/Server";

describe("ProductsCtrl", () => {
  let request: SuperTest.Agent;

  beforeEach(
    PlatformTest.bootstrap(Server, {
      mount: {
        "/rest": [ProductsCtrl]
      },
      responseFilters: [PaginationFilter]
    })
  );
  afterEach(PlatformTest.reset);

  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  it("should generate spec", () => {
    const spec = getSpec(PlatformTest, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      paths: {
        "/pageable": {
          get: {
            operationId: "productsCtrlGet",
            parameters: [
              {
                in: "query",
                required: false,
                name: "page",
                schema: {type: "integer", description: "Page number.", default: 0, minimum: 0, multipleOf: 1}
              },
              {
                in: "query",
                required: false,
                name: "size",
                schema: {
                  type: "integer",
                  description: "Number of objects per page.",
                  default: 20,
                  minimum: 1,
                  multipleOf: 1
                }
              },
              {
                in: "query",
                required: false,
                name: "sort",
                schema: {
                  type: "array",
                  description:
                    "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
                  maxItems: 2,
                  items: {type: "string"}
                }
              },
              {in: "query", name: "all", required: false, schema: {type: "boolean"}}
            ],
            responses: {
              "200": {
                content: {"application/json": {schema: {$ref: "#/components/schemas/PaginatedProduct"}}},
                description: "Success"
              },
              "206": {
                content: {"application/json": {schema: {$ref: "#/components/schemas/PaginatedProduct"}}},
                description: "Partial Content"
              }
            },
            tags: ["ProductsCtrlCtrl"]
          }
        }
      },
      tags: [{name: "ProductsCtrlCtrl"}],
      components: {
        schemas: {
          Product: {
            type: "object",
            properties: {id: {type: "string"}, title: {type: "string"}}
          },
          PaginatedProduct: {
            type: "object",
            properties: {
              page: {
                type: "integer",
                description: "Page number.",
                default: 0,
                minimum: 0,
                multipleOf: 1
              },
              size: {
                type: "integer",
                description: "Number of objects per page.",
                default: 20,
                minimum: 1,
                multipleOf: 1
              },
              sort: {
                type: "array",
                description:
                  "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
                maxItems: 2,
                items: {type: "string"}
              },
              data: {type: "array", items: {$ref: "#/components/schemas/Product"}},
              totalCount: {type: "integer", minLength: 0, multipleOf: 1}
            }
          }
        }
      }
    });
  });

  it("should get paginated products with a status 206 Partial Content", async () => {
    const options = {
      page: 1,
      size: 10,
      sort: ["field", "asc"]
    };

    const {body} = await request.get("/rest/pageable?" + qs.stringify(options)).expect(206);

    expect(body).toEqual({
      data: [
        {
          id: "100",
          title: "CANON D3000"
        }
      ],
      page: 1,
      size: 10,
      sort: ["asc", "field"],
      totalCount: 100
    });
  });

  it("should get all products with a status 216", async () => {
    const options = {
      all: true
    };

    const {body} = await request.get("/rest/pageable?" + qs.stringify(options)).expect(200);

    expect(body).toEqual({
      data: [{id: "100", title: "CANON D3000"}],
      totalCount: 1,
      page: 0,
      size: 20
    });
  });

  it("should not return a bad request when sort is not given", async () => {
    const options = {
      page: 1,
      size: 10
    };

    const {body} = await request.get("/rest/pageable?" + qs.stringify(options)).expect(216);

    expect(body).toEqual({
      data: [
        {
          id: "100",
          title: "CANON D3000"
        }
      ],
      page: 1,
      size: 10,
      totalCount: 100
    });
  });

  it("should apply default pagination parameters", async () => {
    const options = {};

    const {body} = await request.get("/rest/pageable?" + qs.stringify(options)).expect(216);

    expect(body).toEqual({
      data: [{id: "100", title: "CANON D3000"}],
      totalCount: 100,
      page: 0,
      size: 20
    });
  });

  it("should throw bad request when options isn't correct", async () => {
    const options = {
      page: -1
    };

    const {body} = await request.get("/rest/pageable?" + qs.stringify(options)).expect(400);

    expect(body).toEqual({
      errors: [
        {
          data: -1,
          dataPath: ".page",
          keyword: "minimum",
          message: "should be >= 0",
          modelName: "Pageable",
          params: {
            comparison: ">=",
            exclusive: false,
            limit: 0
          },
          schemaPath: "#/properties/page/minimum"
        }
      ],
      message: 'Bad request on parameter "request.query".\nPageable.page should be >= 0. Given value: -1',
      name: "AJV_VALIDATION_ERROR",
      status: 400
    });
  });
});
