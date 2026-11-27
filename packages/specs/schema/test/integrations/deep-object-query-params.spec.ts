import {Enum, GenericOf, Generics, OperationPath, Path, Property, SpecTypes, enums, getSpec, number} from "../../src/index.js";
import {QueryParams} from "@tsed/platform-params";

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

    expect(spec).toMatchInlineSnapshot(`
      {
        "components": {
          "schemas": {
            "DeepQueryObject": {
              "properties": {
                "condition": {
                  "type": "string",
                },
                "path": {
                  "type": "string",
                },
                "value": {
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
              "operationId": "testDeepObjectCtrlGet",
              "parameters": [
                {
                  "explode": true,
                  "in": "query",
                  "name": "s",
                  "required": false,
                  "schema": {
                    "$ref": "#/components/schemas/DeepQueryObject",
                  },
                  "style": "deepObject",
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
  it("shouldn't add deepObject style if the parameter is an enum", () => {
    enum Scope {
      admin = "admin",
      public = "public"
    }

    enums(Scope).label("Scope");

    @Path("/example")
    class ExampleController {
      @OperationPath("GET", "/")
      async list(
        @QueryParams("scope")
        @Enum(Scope)
        scope?: Scope
      ) {}
    }

    expect(getSpec(ExampleController, {specType: SpecTypes.OPENAPI})).toMatchInlineSnapshot(`
      {
        "components": {
          "schemas": {
            "Scope": {
              "enum": [
                "admin",
                "public",
              ],
              "type": "string",
            },
          },
        },
        "paths": {
          "/example": {
            "get": {
              "operationId": "exampleControllerList",
              "parameters": [
                {
                  "in": "query",
                  "name": "scope",
                  "required": false,
                  "schema": {
                    "$ref": "#/components/schemas/Scope",
                  },
                },
              ],
              "responses": {
                "200": {
                  "description": "Success",
                },
              },
              "tags": [
                "ExampleController",
              ],
            },
          },
        },
        "tags": [
          {
            "name": "ExampleController",
          },
        ],
      }
    `);
  });
  it("should add deepObject style on a generic model property when QueryParams takes the whole model", () => {
    @Generics("T")
    class Between<T> {
      @Property("T")
      gt?: T;

      @Property("T")
      lt?: T;
    }

    class Filters {
      @Property()
      name: string;

      @GenericOf(number().integer())
      range?: Between<number>;
    }

    @Path("/filters")
    class TestDeepObjectCtrl {
      @OperationPath("GET", "/")
      async get(@QueryParams() filters: Filters) {}
    }

    const spec: any = getSpec(TestDeepObjectCtrl, {specType: SpecTypes.OPENAPI});
    const [name, range] = spec.paths["/filters"].get.parameters;

    expect(name).toEqual({in: "query", name: "name", required: false, schema: {type: "string"}});
    expect(range).toMatchObject({in: "query", name: "range", style: "deepObject", explode: true});
    expect(range.schema.allOf[0]).toEqual({$ref: "#/components/schemas/Between"});
  });
  it("should add deepObject style on a named generic query parameter", () => {
    @Generics("T")
    class Between<T> {
      @Property("T")
      gt?: T;
    }

    @Path("/filters")
    class TestDeepObjectCtrl {
      @OperationPath("GET", "/")
      async get(@QueryParams("range") @GenericOf(number().integer()) range: Between<number>) {}
    }

    const spec: any = getSpec(TestDeepObjectCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec.paths["/filters"].get.parameters[0]).toMatchObject({name: "range", style: "deepObject", explode: true});
  });
});
