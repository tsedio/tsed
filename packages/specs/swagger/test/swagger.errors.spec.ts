import {Controller, Get, PlatformTest} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {Required, Returns} from "@tsed/schema";
import {expect} from "chai";
import SuperTest from "supertest";
import {Server} from "./app/Server";

export class TestModel200 {
  @Required()
  exampleItem: number;
}

export class TestModel400 {
  @Required()
  error: boolean;
}

export class TestModel500 {
  @Required()
  error: boolean;
}

@Controller("/scenarios")
class ErrorsController {
  @Get("/")
  // This shows up in swagger
  @Returns(200, TestModel200)
  @Returns(400, TestModel400)
  @Returns(500, TestModel500)
  public async exampleControllerMethod() {
    return {
      exampleItem: 1
    };
  }
}

describe("Swagger errors params", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  beforeEach(
    PlatformTest.bootstrap(Server, {
      platform: PlatformExpress,
      mount: {
        "/rest": [ErrorsController]
      }
    })
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterEach(PlatformTest.reset);

  it("should generate swagger", async () => {
    const response = await request.get("/v2/doc/swagger.json").expect(200);
    expect(response.body).to.deep.eq({
      "components": {
        "schemas": {
          "TestModel200": {
            "properties": {
              "exampleItem": {
                "type": "number"
              }
            },
            "required": [
              "exampleItem"
            ],
            "type": "object"
          },
          "TestModel400": {
            "properties": {
              "error": {
                "type": "boolean"
              }
            },
            "required": [
              "error"
            ],
            "type": "object"
          },
          "TestModel500": {
            "properties": {
              "error": {
                "type": "boolean"
              }
            },
            "required": [
              "error"
            ],
            "type": "object"
          }
        }
      },
      "info": {
        "title": "Swagger title",
        "version": "1.2.0",
      },
      "openapi": "3.0.1",
      "paths": {
        "/rest/scenarios": {
          "get": {
            "operationId": "errorsControllerExampleControllerMethod",
            "parameters": [],
            "responses": {
              "200": {
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/TestModel200"
                    }
                  }
                },
                "description": "Success"
              },
              "400": {
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/TestModel400"
                    }
                  }
                },
                "description": "Bad Request"
              },
              "500": {
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/TestModel500"
                    }
                  }
                },
                "description": "Internal Server Error"
              }
            },
            "tags": [
              "ErrorsController"
            ]
          }
        }
      },
      "tags": [
        {
          "name": "ErrorsController"
        }
      ]
    });

    await request.get("/rest/scenarios/4?name=name&duration=1&locale=fr-FR");
  });
});
