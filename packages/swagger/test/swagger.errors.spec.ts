import {Controller, Get, PlatformTest, Required} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Returns} from "../src/decorators/returns";
import {Server} from "./helpers/Server";

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
  @Returns(200, {type: TestModel200})
  @Returns(400, {type: TestModel400})
  @Returns(500, {type: TestModel500})
  public async exampleControllerMethod() {
    return {
      exampleItem: 1
    };
  }
}

describe("QueryParams", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  beforeEach(PlatformTest.bootstrap(Server, {
    mount: {
      "/rest": [ErrorsController]
    }
  }));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterEach(PlatformTest.reset);

  it("should generate swagger", async () => {
    const response = await request.get("/api-doc/swagger.json").expect(200);
    expect(response.body).to.deep.eq({
      "consumes": [
        "application/json"
      ],
      "definitions": {
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
      },
      "info": {
        "description": "",
        "termsOfService": "",
        "title": "Api documentation",
        "version": "1.0.0"
      },
      "paths": {
        "/rest/scenarios": {
          "get": {
            "operationId": "ErrorsController.exampleControllerMethod",
            "responses": {
              "200": {
                "description": "Success",
                "schema": {
                  "$ref": "#/definitions/TestModel200"
                }
              },
              "400": {
                "description": "Bad Request",
                "schema": {
                  "$ref": "#/definitions/TestModel400"
                }
              },
              "500": {
                "description": "Internal Server Error",
                "schema": {
                  "$ref": "#/definitions/TestModel500"
                }
              }
            },
            "tags": [
              "ErrorsController"
            ]
          }
        }
      },
      "produces": [
        "application/json"
      ],
      "securityDefinitions": {},
      "swagger": "2.0",
      "tags": [
        {
          "name": "ErrorsController"
        }
      ]
    });

    await request.get("/rest/scenarios/4?name=name&duration=1&locale=fr-FR");
  });
});
