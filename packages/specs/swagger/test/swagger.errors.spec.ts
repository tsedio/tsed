import {Controller} from "@tsed/di";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Get, Required, Returns} from "@tsed/schema";
import SuperTest from "supertest";

import {Server} from "./app/Server.js";

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
  public exampleControllerMethod() {
    return Promise.resolve({
      exampleItem: 1
    });
  }
}

describe("Swagger errors params", () => {
  let request: SuperTest.Agent;
  beforeEach(
    PlatformTest.bootstrap(Server, {
      adapter: PlatformExpress,
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
    expect(response.body).toEqual({
      consumes: ["application/json"],
      definitions: {
        TestModel200: {
          properties: {
            exampleItem: {
              type: "number"
            }
          },
          required: ["exampleItem"],
          type: "object"
        },
        TestModel400: {
          properties: {
            error: {
              type: "boolean"
            }
          },
          required: ["error"],
          type: "object"
        },
        TestModel500: {
          properties: {
            error: {
              type: "boolean"
            }
          },
          required: ["error"],
          type: "object"
        }
      },
      info: {
        title: "Swagger title",
        version: "1.2.0"
      },
      paths: {
        "/rest/scenarios": {
          get: {
            operationId: "errorsControllerExampleControllerMethod",
            parameters: [],
            produces: ["application/json"],
            responses: {
              "200": {
                description: "Success",
                schema: {
                  $ref: "#/definitions/TestModel200"
                }
              },
              "400": {
                description: "Bad Request",
                schema: {
                  $ref: "#/definitions/TestModel400"
                }
              },
              "500": {
                description: "Internal Server Error",
                schema: {
                  $ref: "#/definitions/TestModel500"
                }
              }
            },
            tags: ["ErrorsController"]
          }
        }
      },
      produces: ["application/json"],
      swagger: "2.0",
      tags: [
        {
          name: "ErrorsController"
        }
      ]
    });

    await request.get("/rest/scenarios/4?name=name&duration=1&locale=fr-FR");
  });
});
