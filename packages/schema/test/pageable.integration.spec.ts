import {QueryParams} from "@tsed/common/src";
import {isArray} from "@tsed/core";
import {expect} from "chai";
import {getSpec, SpecTypes} from "../src";
import {
  CollectionOf,
  Default,
  Description,
  Generics,
  Integer,
  MaxItems,
  Min,
  MinLength,
  OperationPath,
  Path,
  Property,
  Required,
  Returns
} from "../src/decorators";
import {validateSpec} from "./helpers/validateSpec";


class Sort {
  @Required()
  property: string;

  @Property()
  direction: "asc" | "desc" = "asc";

  constructor(options?: [string, "asc" | "desc"][] | Sort) {
    if (isArray<string>(options)) {
      this.property = options[0];
      this.direction = options[1] as "asc" | "desc";
    } else if (options) {
      const {property, direction} = options as Sort;
      this.property = property;
      this.direction = direction;
    }
  }
}

class Pageable {
  @Integer()
  @Min(0)
  @Default(0)
  @Description("Page number.")
  page: number = 0;

  @Integer()
  @Min(1)
  @Default(20)
  @Description("Number of objects per page.")
  size: number = 20;

  private _sort: Sort;

  constructor(options: Partial<Pageable>) {
    options.page && (this.page = options.page);
    options.size && (this.size = options.size);
    options.sort && (this._sort = options.sort);
  }

  get offset() {
    return this.page ? this.page * this.limit : 0;
  }

  @CollectionOf(String, Array)
  @MaxItems(2)
  @Description("Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.")
  get sort(): Sort {
    return this._sort;
  }

  set sort(sort: Sort) {
    this._sort = new Sort(sort);
  }

  get limit() {
    return this.size;
  }
}

@Generics("T")
class Pagination<T> extends Pageable {
  @CollectionOf("T")
  data: T[];

  @Integer()
  @MinLength(0)
  totalCount: number = 0;

  constructor({data, totalCount, pageable}: Partial<Pagination<T>> & { pageable: Pageable }) {
    super(pageable);
    data && (this.data = data);
    totalCount && (this.totalCount = totalCount);
  }

  get isPaginated() {
    return this.data.length < this.totalCount;
  }
}

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

@Path("/pageable")
class TestPageableCtrl {
  @OperationPath("GET", "/")
  @Returns(206, Pagination).Of(Product).Title("PaginatedProduct")
  @Returns(200, Pagination).Of(Product).Title("PaginatedProduct")
  async get(@QueryParams() pageableOptions: Pageable, @QueryParams("all") all: boolean) {
    return new Pagination<Product>({
      data: [new Product({
        id: "100",
        title: "CANON D3000"
      })],
      totalCount: all ? 1 : 100, // just for test
      pageable: pageableOptions
    });
  }
}

describe("Spec: Pageable", () => {
  it("should generate the OS3", async () => {
    const spec = getSpec(TestPageableCtrl, {specType: SpecTypes.OPENAPI});
    expect(await validateSpec(spec, SpecTypes.OPENAPI)).to.eq(true);
    expect(spec).to.deep.eq({
      "paths": {
        "/pageable": {
          "get": {
            "operationId": "testPageableCtrlGet",
            "parameters": [{
              "in": "query",
              "required": false,
              "name": "page",
              "schema": {"type": "integer", "description": "Page number.", "default": 0, "minimum": 0, "multipleOf": 1}
            }, {
              "in": "query",
              "required": false,
              "name": "size",
              "schema": {
                "type": "integer",
                "description": "Number of objects per page.",
                "default": 20,
                "minimum": 1,
                "multipleOf": 1
              }
            }, {
              "in": "query",
              "required": false,
              "name": "sort",
              "schema": {
                "type": "array",
                "description": "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
                "maxItems": 2,
                "items": {"type": "string"}
              }
            }, {"in": "query", "name": "all", "required": false, "schema": {"type": "boolean"}}],
            "responses": {
              "200": {
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/PaginatedProduct"}}},
                "description": "Success"
              },
              "206": {
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/PaginatedProduct"}}},
                "description": "Partial Content"
              }
            },
            "tags": ["TestPageableCtrl"]
          }
        }
      },
      "tags": [{"name": "TestPageableCtrl"}],
      "components": {
        "schemas": {
          "Product": {
            "type": "object",
            "properties": {"id": {"type": "string"}, "title": {"type": "string"}}
          },
          "PaginatedProduct": {
            "type": "object",
            "properties": {
              "page": {
                "type": "integer",
                "description": "Page number.",
                "default": 0,
                "minimum": 0,
                "multipleOf": 1
              },
              "size": {
                "type": "integer",
                "description": "Number of objects per page.",
                "default": 20,
                "minimum": 1,
                "multipleOf": 1
              },
              "sort": {
                "type": "array",
                "description": "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
                "maxItems": 2,
                "items": {"type": "string"}
              },
              "data": {"type": "array", "items": {"$ref": "#/components/schemas/Product"}},
              "totalCount": {"type": "integer", "minLength": 0, "multipleOf": 1}
            }
          }
        }
      }
    });
  });
  it("should generate the OS2", async () => {
    const spec = getSpec(TestPageableCtrl, {specType: SpecTypes.SWAGGER});

    expect(await validateSpec(spec)).to.eq(true);
    expect(spec).to.deep.eq({
      "paths": {
        "/pageable": {
          "get": {
            "operationId": "testPageableCtrlGet",
            "parameters": [{
              "in": "query",
              "required": false,
              "name": "page",
              "type": "integer",
              "description": "Page number.",
              "default": 0,
              "minimum": 0,
              "multipleOf": 1
            }, {
              "in": "query",
              "required": false,
              "name": "size",
              "type": "integer",
              "description": "Number of objects per page.",
              "default": 20,
              "minimum": 1,
              "multipleOf": 1
            }, {
              "in": "query",
              "required": false,
              "name": "sort",
              "type": "array",
              "description": "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
              "maxItems": 2,
              "items": {"type": "string"}
            }, {"in": "query", "name": "all", "required": false, "type": "boolean"}],
            "responses": {
              "200": {"description": "Success", "schema": {"$ref": "#/definitions/PaginatedProduct"}},
              "206": {"description": "Partial Content", "schema": {"$ref": "#/definitions/PaginatedProduct"}}
            },
            "produces": ["application/json"],
            "tags": ["TestPageableCtrl"]
          }
        }
      },
      "tags": [{"name": "TestPageableCtrl"}],
      "definitions": {
        "Product": {
          "type": "object",
          "properties": {"id": {"type": "string"}, "title": {"type": "string"}}
        },
        "PaginatedProduct": {
          "type": "object",
          "properties": {
            "page": {
              "type": "integer",
              "description": "Page number.",
              "default": 0,
              "minimum": 0,
              "multipleOf": 1
            },
            "size": {
              "type": "integer",
              "description": "Number of objects per page.",
              "default": 20,
              "minimum": 1,
              "multipleOf": 1
            },
            "sort": {
              "type": "array",
              "description": "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
              "maxItems": 2,
              "items": {"type": "string"}
            },
            "data": {"type": "array", "items": {"$ref": "#/definitions/Product"}},
            "totalCount": {"type": "integer", "minLength": 0, "multipleOf": 1}
          }
        }
      }
    });
  });
});
