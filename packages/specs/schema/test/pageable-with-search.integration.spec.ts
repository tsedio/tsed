import {array, getJsonSchema, getSpec, In, OneOf, Required, SpecTypes, string} from "../src";
import {OperationPath, Path, Property, Returns} from "../src/decorators";
import {validateSpec} from "./helpers/validateSpec";
import {Pageable} from "./pageable.integration.spec";

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
class TestPageableCtrl {
  @OperationPath("GET", "/")
  @(Returns(206, ContactQueryParams))
  async get(@In("query") pageableOptions: ContactQueryParams) {

  }
}

describe("Spec: ContactQueryParams", () => {
  it("should generate the JSON", () => {
    const schema = getJsonSchema(ContactQueryParams);

    expect(schema).toEqual({
      "definitions": {
        "ContainsSearchableString": {
          "properties": {
            "con": {
              "minLength": 1,
              "type": "string"
            }
          },
          "required": [
            "con"
          ],
          "type": "object"
        },
        "EqualsSearchableString": {
          "properties": {
            "eq": {
              "minLength": 1,
              "type": "string"
            }
          },
          "required": [
            "eq"
          ],
          "type": "object"
        }
      },
      "properties": {
        "email": {
          "oneOf": [
            {
              "$ref": "#/definitions/ContainsSearchableString"
            },
            {
              "$ref": "#/definitions/EqualsSearchableString"
            }
          ]
        },
        "page": {
          "default": 0,
          "description": "Page number.",
          "minimum": 0,
          "multipleOf": 1,
          "type": "integer"
        },
        "search": {
          "$ref": "#/definitions/ContainsSearchableString"
        },
        "size": {
          "default": 20,
          "description": "Number of objects per page.",
          "minimum": 1,
          "multipleOf": 1,
          "type": "integer"
        },
        "sort": {
          "description": "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
          "oneOf": [
            {
              "type": "string"
            },
            {
              "items": {
                "type": "string"
              },
              "maxItems": 2,
              "type": "array"
            }
          ]
        }
      },
      "type": "object"
    });
  });
  it("should generate the OS3", async () => {
    const spec = getSpec(TestPageableCtrl, { specType: SpecTypes.OPENAPI });

    expect(spec).toEqual({
      "components": {
        "schemas": {
          "ContactQueryParams": {
            "properties": {
              "email": {
                "oneOf": [
                  {
                    "$ref": "#/components/schemas/ContainsSearchableString"
                  },
                  {
                    "$ref": "#/components/schemas/EqualsSearchableString"
                  }
                ]
              },
              "page": {
                "default": 0,
                "description": "Page number.",
                "minimum": 0,
                "multipleOf": 1,
                "type": "integer"
              },
              "search": {
                "$ref": "#/components/schemas/ContainsSearchableString"
              },
              "size": {
                "default": 20,
                "description": "Number of objects per page.",
                "minimum": 1,
                "multipleOf": 1,
                "type": "integer"
              },
              "sort": {
                "description": "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
                "items": {
                  "type": "string"
                },
                "maxItems": 2,
                "type": "array"
              }
            },
            "type": "object"
          },
          "ContainsSearchableString": {
            "properties": {
              "con": {
                "minLength": 1,
                "type": "string"
              }
            },
            "required": [
              "con"
            ],
            "type": "object"
          },
          "EqualsSearchableString": {
            "properties": {
              "eq": {
                "minLength": 1,
                "type": "string"
              }
            },
            "required": [
              "eq"
            ],
            "type": "object"
          }
        }
      },
      "paths": {
        "/contacts": {
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
                  "type": "integer"
                }
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
                  "type": "integer"
                }
              },
              {
                "description": "Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
                "in": "query",
                "name": "sort",
                "required": false,
                "schema": {
                  "items": {
                    "type": "string"
                  },
                  "maxItems": 2,
                  "type": "array"
                }
              },
              {
                "in": "query",
                "name": "search",
                "required": false,
                "style": "deepObject",
                "schema": {
                  "$ref": "#/components/schemas/ContainsSearchableString"
                }
              },
              {
                "in": "query",
                "name": "email",
                "required": false,
                "schema": {
                  "oneOf": [
                    {
                      "$ref": "#/components/schemas/ContainsSearchableString"
                    },
                    {
                      "$ref": "#/components/schemas/EqualsSearchableString"
                    }
                  ]
                }
              }
            ],
            "responses": {
              "206": {
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/ContactQueryParams"
                    }
                  }
                },
                "description": "Partial Content"
              }
            },
            "tags": [
              "TestPageableCtrl"
            ]
          }
        }
      },
      "tags": [
        {
          "name": "TestPageableCtrl"
        }
      ]
    });
    expect(await validateSpec(spec, SpecTypes.OPENAPI)).toBe(true);
  });
});
