import {BodyParams, Controller, Post} from "@tsed/common";
import {expect} from "chai";
import {GenericOf, Generics, getJsonSchema, getSpec, Property, SpecTypes} from "../src";
import {validateSpec} from "./helpers/validateSpec";

@Generics("T")
export class UserProperty<T> {
  @Property("T")
  value: T;
}

export class Adjustment {
  @GenericOf(Number)
  adjustment: UserProperty<number>;
}

@Controller("/hello-world")
export class HelloWorldController {
  @Post("/")
  get(@BodyParams() m: Adjustment) {
    return m;
  }
}

describe("Generics", () => {
  it("should generated the JsonSchema", () => {
    const spec = getJsonSchema(Adjustment);

    expect(spec).to.deep.equal({
      "properties": {
        "adjustment": {
          "properties": {
            "value": {
              "type": "number"
            }
          },
          "type": "object"
        }
      },
      "type": "object"
    });
  });
  it("should generate the OS3", async () => {
    const spec = getSpec(HelloWorldController, {specType: SpecTypes.OPENAPI});

    expect(spec).to.deep.eq({
      "components": {
        "schemas": {
          "Adjustment": {
            "properties": {
              "adjustment": {
                "properties": {
                  "value": {
                    "type": "number"
                  }
                },
                "type": "object"
              }
            },
            "type": "object"
          }
        }
      },
      "paths": {
        "/hello-world": {
          "post": {
            "operationId": "helloWorldControllerGet",
            "parameters": [],
            "requestBody": {
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Adjustment"
                  }
                }
              },
              "required": false
            },
            "responses": {
              "200": {
                "description": "Success"
              }
            },
            "tags": [
              "HelloWorldController"
            ]
          }
        }
      },
      "tags": [
        {
          "name": "HelloWorldController"
        }
      ]
    });
    expect(await validateSpec(spec, SpecTypes.OPENAPI)).to.eq(true);
  });
  it("should generate the OS2", async () => {
    const spec = getSpec(HelloWorldController, {specType: SpecTypes.SWAGGER});

    expect(await validateSpec(spec)).to.eq(true);
    expect(spec).to.deep.eq({
      "definitions": {
        "Adjustment": {
          "properties": {
            "adjustment": {
              "properties": {
                "value": {
                  "type": "number"
                }
              },
              "type": "object"
            }
          },
          "type": "object"
        }
      },
      "paths": {
        "/hello-world": {
          "post": {
            "operationId": "helloWorldControllerGet",
            "parameters": [
              {
                "in": "body",
                "name": "body",
                "required": false,
                "schema": {
                  "$ref": "#/definitions/Adjustment"
                }
              }
            ],
            "responses": {
              "200": {
                "description": "Success"
              }
            },
            "tags": [
              "HelloWorldController"
            ]
          }
        }
      },
      "tags": [
        {
          "name": "HelloWorldController"
        }
      ]
    });
  });
});