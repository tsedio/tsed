import {QueryParams} from "@tsed/platform-params";

import {
  array,
  CollectionOf,
  Default,
  Description,
  For,
  GenericOf,
  Generics,
  getJsonSchema,
  getSpec,
  In,
  Integer,
  Maximum,
  Min,
  Minimum,
  MinLength,
  Name,
  OneOf,
  oneOf,
  OperationPath,
  Path,
  Property,
  Required,
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
  @(Returns(206, Pagination).Of(Product).Label("PaginatedProduct"))
  @(Returns(200, Pagination).Of(Product).Label("PaginatedProduct"))
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

class EqualsSearchableString {
  @Required()
  eq: string;
}

class ContainsSearchableString {
  @Required()
  con: string;
}

export class ContactQueryParams extends Pageable {
  @OneOf(ContainsSearchableString)
  search?: ContainsSearchableString;

  @OneOf(ContainsSearchableString, EqualsSearchableString)
  @Property()
  email?: ContainsSearchableString | EqualsSearchableString;
}

@Path("/contacts")
class TestContactPageableCtrl {
  @OperationPath("GET", "/")
  @Returns(206, ContactQueryParams)
  async get(@In("query") pageableOptions: ContactQueryParams) {}
}

describe("Generics: Pageable - Testing pagination functionality with generic types", () => {
  it("should generate the correct JSON schema for the Pageable class", () => {
    const schema = getJsonSchema(Pageable);

    expect(schema).toMatchInlineSnapshot(`
      {
        "properties": {
          "page": {
            "default": 0,
            "description": "Page number.",
            "minimum": 0,
            "multipleOf": 1,
            "type": "integer",
          },
          "size": {
            "default": 20,
            "description": "Number of objects per page.",
            "minimum": 1,
            "multipleOf": 1,
            "type": "integer",
          },
          "sort": {
            "description": "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
            "oneOf": [
              {
                "type": "string",
              },
              {
                "items": {
                  "type": "string",
                },
                "maxItems": 2,
                "type": "array",
              },
            ],
          },
        },
        "type": "object",
      }
    `);
  });
  it("should generate the correct OpenAPI 3.0 specification for the TestPageableCtrl", async () => {
    const spec = getSpec(TestPageableCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toMatchInlineSnapshot(`
      {
        "components": {
          "schemas": {
            "PaginatedProduct": {
              "allOf": [
                {
                  "$ref": "#/components/schemas/Pagination",
                },
                {
                  "properties": {
                    "data": {
                      "items": {
                        "$ref": "#/components/schemas/Product",
                      },
                      "type": "array",
                    },
                  },
                  "type": "object",
                },
              ],
            },
            "Pagination": {
              "properties": {
                "data": {
                  "type": "array",
                },
                "page": {
                  "default": 0,
                  "description": "Page number.",
                  "minimum": 0,
                  "multipleOf": 1,
                  "type": "integer",
                },
                "size": {
                  "default": 20,
                  "description": "Number of objects per page.",
                  "minimum": 1,
                  "multipleOf": 1,
                  "type": "integer",
                },
                "sort": {
                  "description": "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
                  "items": {
                    "type": "string",
                  },
                  "maxItems": 2,
                  "type": "array",
                },
                "totalCount": {
                  "minLength": 0,
                  "multipleOf": 1,
                  "type": "integer",
                },
              },
              "type": "object",
            },
            "Product": {
              "properties": {
                "id": {
                  "type": "string",
                },
                "title": {
                  "type": "string",
                },
              },
              "type": "object",
            },
          },
        },
        "paths": {
          "/pageable": {
            "get": {
              "operationId": "testPageableCtrlGet",
              "parameters": [
                {
                  "description": "Page number.",
                  "in": "query",
                  "name": "page",
                  "required": false,
                  "schema": {
                    "default": 0,
                    "minimum": 0,
                    "multipleOf": 1,
                    "type": "integer",
                  },
                },
                {
                  "description": "Number of objects per page.",
                  "in": "query",
                  "name": "size",
                  "required": false,
                  "schema": {
                    "default": 20,
                    "minimum": 1,
                    "multipleOf": 1,
                    "type": "integer",
                  },
                },
                {
                  "description": "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
                  "in": "query",
                  "name": "sort",
                  "required": false,
                  "schema": {
                    "items": {
                      "type": "string",
                    },
                    "maxItems": 2,
                    "type": "array",
                  },
                },
                {
                  "in": "query",
                  "name": "all",
                  "required": false,
                  "schema": {
                    "type": "boolean",
                  },
                },
              ],
              "responses": {
                "200": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/PaginatedProduct",
                      },
                    },
                  },
                  "description": "Success",
                },
                "206": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/PaginatedProduct",
                      },
                    },
                  },
                  "description": "Partial Content",
                },
              },
              "tags": [
                "TestPageableCtrl",
              ],
            },
          },
        },
        "tags": [
          {
            "name": "TestPageableCtrl",
          },
        ],
      }
    `);
    expect(await validateSpec(spec, SpecTypes.OPENAPI)).toBe(true);
  });
  it("should generate the correct specification for deep object structures with generic types", () => {
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

    expect(spec).toMatchInlineSnapshot(`
      {
        "components": {
          "schemas": {
            "FindQuery": {
              "properties": {
                "tableColumnNameA": {
                  "type": "number",
                },
                "tableColumnNameB": {
                  "type": "number",
                },
              },
              "type": "object",
            },
            "PaginationQuery": {
              "properties": {
                "limit": {
                  "default": 50,
                  "maximum": 1000,
                  "minimum": 1,
                  "type": "number",
                },
                "offset": {
                  "default": 0,
                  "minimum": 0,
                  "type": "number",
                },
                "where": {},
              },
              "type": "object",
            },
          },
        },
        "paths": {
          "/pageable": {
            "get": {
              "operationId": "testDeepObjectCtrlGet",
              "parameters": [
                {
                  "in": "query",
                  "name": "s",
                  "required": false,
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginationQuery",
                      },
                      {
                        "properties": {
                          "where": {
                            "$ref": "#/components/schemas/FindQuery",
                          },
                        },
                        "type": "object",
                      },
                    ],
                  },
                },
              ],
              "responses": {
                "200": {
                  "description": "Success",
                },
              },
              "tags": [
                "TestDeepObjectCtrl",
              ],
            },
          },
        },
        "tags": [
          {
            "name": "TestDeepObjectCtrl",
          },
        ],
      }
    `);
  });
  it("should generate the correct specification for deep object structures with generic types when no expression is provided", () => {
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

    expect(spec).toMatchInlineSnapshot(`
      {
        "components": {
          "schemas": {
            "FindQuery": {
              "properties": {
                "tableColumnNameA": {
                  "type": "number",
                },
                "tableColumnNameB": {
                  "type": "number",
                },
              },
              "type": "object",
            },
            "PaginationQuery": {
              "properties": {
                "limit": {
                  "default": 50,
                  "maximum": 1000,
                  "minimum": 1,
                  "type": "number",
                },
                "offset": {
                  "default": 0,
                  "minimum": 0,
                  "type": "number",
                },
                "where": {},
              },
              "type": "object",
            },
          },
        },
        "paths": {
          "/pageable": {
            "get": {
              "operationId": "testDeepObjectCtrlGet",
              "parameters": [
                {
                  "in": "query",
                  "required": false,
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/PaginationQuery",
                      },
                      {
                        "properties": {
                          "where": {
                            "$ref": "#/components/schemas/FindQuery",
                          },
                        },
                        "type": "object",
                      },
                    ],
                  },
                },
              ],
              "responses": {
                "200": {
                  "description": "Success",
                },
              },
              "tags": [
                "TestDeepObjectCtrl",
              ],
            },
          },
        },
        "tags": [
          {
            "name": "TestDeepObjectCtrl",
          },
        ],
      }
    `);
  });
  it("should generate the correct JSON schema for the ContactQueryParams class", () => {
    const schema = getJsonSchema(ContactQueryParams);

    expect(schema).toMatchInlineSnapshot(`
      {
        "definitions": {
          "ContainsSearchableString": {
            "properties": {
              "con": {
                "minLength": 1,
                "type": "string",
              },
            },
            "required": [
              "con",
            ],
            "type": "object",
          },
          "EqualsSearchableString": {
            "properties": {
              "eq": {
                "minLength": 1,
                "type": "string",
              },
            },
            "required": [
              "eq",
            ],
            "type": "object",
          },
        },
        "properties": {
          "email": {
            "oneOf": [
              {
                "$ref": "#/definitions/ContainsSearchableString",
              },
              {
                "$ref": "#/definitions/EqualsSearchableString",
              },
            ],
          },
          "page": {
            "default": 0,
            "description": "Page number.",
            "minimum": 0,
            "multipleOf": 1,
            "type": "integer",
          },
          "search": {
            "$ref": "#/definitions/ContainsSearchableString",
          },
          "size": {
            "default": 20,
            "description": "Number of objects per page.",
            "minimum": 1,
            "multipleOf": 1,
            "type": "integer",
          },
          "sort": {
            "description": "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
            "oneOf": [
              {
                "type": "string",
              },
              {
                "items": {
                  "type": "string",
                },
                "maxItems": 2,
                "type": "array",
              },
            ],
          },
        },
        "type": "object",
      }
    `);
  });
  it("should generate the correct OpenAPI 3.0 specification for the TestContactPageableCtrl", async () => {
    const spec = getSpec(TestContactPageableCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toMatchInlineSnapshot(`
      {
        "components": {
          "schemas": {
            "ContactQueryParams": {
              "properties": {
                "email": {
                  "oneOf": [
                    {
                      "$ref": "#/components/schemas/ContainsSearchableString",
                    },
                    {
                      "$ref": "#/components/schemas/EqualsSearchableString",
                    },
                  ],
                },
                "page": {
                  "default": 0,
                  "description": "Page number.",
                  "minimum": 0,
                  "multipleOf": 1,
                  "type": "integer",
                },
                "search": {
                  "$ref": "#/components/schemas/ContainsSearchableString",
                },
                "size": {
                  "default": 20,
                  "description": "Number of objects per page.",
                  "minimum": 1,
                  "multipleOf": 1,
                  "type": "integer",
                },
                "sort": {
                  "description": "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
                  "items": {
                    "type": "string",
                  },
                  "maxItems": 2,
                  "type": "array",
                },
              },
              "type": "object",
            },
            "ContainsSearchableString": {
              "properties": {
                "con": {
                  "minLength": 1,
                  "type": "string",
                },
              },
              "required": [
                "con",
              ],
              "type": "object",
            },
            "EqualsSearchableString": {
              "properties": {
                "eq": {
                  "minLength": 1,
                  "type": "string",
                },
              },
              "required": [
                "eq",
              ],
              "type": "object",
            },
          },
        },
        "paths": {
          "/contacts": {
            "get": {
              "operationId": "testContactPageableCtrlGet",
              "parameters": [
                {
                  "description": "Page number.",
                  "in": "query",
                  "name": "page",
                  "required": false,
                  "schema": {
                    "default": 0,
                    "minimum": 0,
                    "multipleOf": 1,
                    "type": "integer",
                  },
                },
                {
                  "description": "Number of objects per page.",
                  "in": "query",
                  "name": "size",
                  "required": false,
                  "schema": {
                    "default": 20,
                    "minimum": 1,
                    "multipleOf": 1,
                    "type": "integer",
                  },
                },
                {
                  "description": "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
                  "in": "query",
                  "name": "sort",
                  "required": false,
                  "schema": {
                    "items": {
                      "type": "string",
                    },
                    "maxItems": 2,
                    "type": "array",
                  },
                },
                {
                  "in": "query",
                  "name": "search",
                  "required": false,
                  "schema": {
                    "$ref": "#/components/schemas/ContainsSearchableString",
                  },
                  "style": "deepObject",
                },
                {
                  "in": "query",
                  "name": "email",
                  "required": false,
                  "schema": {
                    "oneOf": [
                      {
                        "$ref": "#/components/schemas/ContainsSearchableString",
                      },
                      {
                        "$ref": "#/components/schemas/EqualsSearchableString",
                      },
                    ],
                  },
                },
              ],
              "responses": {
                "206": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/ContactQueryParams",
                      },
                    },
                  },
                  "description": "Partial Content",
                },
              },
              "tags": [
                "TestContactPageableCtrl",
              ],
            },
          },
        },
        "tags": [
          {
            "name": "TestContactPageableCtrl",
          },
        ],
      }
    `);
    expect(await validateSpec(spec, SpecTypes.OPENAPI)).toBe(true);
  });
});
