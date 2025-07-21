import {QueryParams} from "@tsed/platform-params";

import {Enum, enums, getSpec, OperationPath, Path, Property, SpecTypes} from "../../src/index.js";

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
});
