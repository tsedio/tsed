import {
  array,
  CollectionOf,
  Default,
  Description,
  For,
  Generics,
  getJsonSchema,
  getSpec,
  In,
  Integer,
  Min,
  MinLength,
  Name,
  oneOf,
  OperationPath,
  Path,
  Property,
  Returns,
  SpecTypes,
  string
} from "../../src/index.js";
import {validateSpec} from "../helpers/validateSpec.js";

export class Pageable {
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

  @For(SpecTypes.JSON, oneOf(string(), array().items(string()).maxItems(2)))
  @For(SpecTypes.OPENAPI, array().items(string()).maxItems(2))
  @For(SpecTypes.SWAGGER, array().items(string()).maxItems(2))
  @Description("Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.")
  sort: string[];

  constructor(options: Partial<Pageable>) {
    options.page && (this.page = options.page);
    options.size && (this.size = options.size);
    options.sort && (this.sort = options.sort);
  }

  get offset() {
    return this.page ? this.page * this.limit : 0;
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

  constructor({data, totalCount, pageable}: Partial<Pagination<T>> & {pageable: Pageable}) {
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
  @(Returns(206, Pagination).Of(Product).Title("PaginatedProduct"))
  @(Returns(200, Pagination).Of(Product).Title("PaginatedProduct"))
  get(@In("query") pageableOptions: Pageable, @In("query") @Name("all") all: boolean) {
    return new Pagination<Product>({
      data: [
        new Product({
          id: "100",
          title: "CANON D3000"
        })
      ],
      totalCount: all ? 1 : 100, // just for test
      pageable: pageableOptions
    });
  }
}

describe("Spec: Pageable", () => {
  it("should generate the JSON", () => {
    const schema = getJsonSchema(Pageable);

    expect(schema).toEqual({
      properties: {
        page: {
          default: 0,
          description: "Page number.",
          minimum: 0,
          multipleOf: 1,
          type: "integer"
        },
        size: {
          default: 20,
          description: "Number of objects per page.",
          minimum: 1,
          multipleOf: 1,
          type: "integer"
        },
        sort: {
          description: "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          oneOf: [
            {
              type: "string"
            },
            {
              items: {
                type: "string"
              },
              maxItems: 2,
              type: "array"
            }
          ]
        }
      },
      type: "object"
    });
  });
  it("should generate the OS3", async () => {
    const spec = getSpec(TestPageableCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      paths: {
        "/pageable": {
          get: {
            operationId: "testPageableCtrlGet",
            parameters: [
              {
                in: "query",
                required: false,
                name: "page",
                description: "Page number.",
                schema: {type: "integer", default: 0, minimum: 0, multipleOf: 1}
              },
              {
                in: "query",
                required: false,
                name: "size",
                description: "Number of objects per page.",
                schema: {
                  type: "integer",
                  default: 20,
                  minimum: 1,
                  multipleOf: 1
                }
              },
              {
                in: "query",
                required: false,
                name: "sort",
                description:
                  "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
                schema: {
                  items: {
                    type: "string"
                  },
                  maxItems: 2,
                  type: "array"
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
            tags: ["TestPageableCtrl"]
          }
        }
      },
      tags: [{name: "TestPageableCtrl"}],
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
                description:
                  "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
                items: {
                  type: "string"
                },
                maxItems: 2,
                type: "array"
              },
              data: {type: "array", items: {$ref: "#/components/schemas/Product"}},
              totalCount: {type: "integer", minLength: 0, multipleOf: 1}
            }
          }
        }
      }
    });
    expect(await validateSpec(spec, SpecTypes.OPENAPI)).toBe(true);
  });
});
