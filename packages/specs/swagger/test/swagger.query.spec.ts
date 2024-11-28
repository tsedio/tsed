import {Controller} from "@tsed/di";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {QueryParams} from "@tsed/platform-params";
import {Get, MinLength, Property, Required} from "@tsed/schema";
import SuperTest from "supertest";

import {Server} from "./app/Server.js";

class QueryParamModel {
  @Required()
  @MinLength(1)
  name: string;

  @Property()
  duration: number;
}

@Controller("/scenarios")
class QueryParamsSwaggerController {
  @Get("/1")
  scenario1(@QueryParams("id") id: string) {}

  @Get("/2")
  scenario2(@QueryParams("ids", String) ids: string[]) {}

  @Get("/3")
  scenario3(@QueryParams("ids", String) ids: Map<string, string>) {}

  @Get("/4")
  scenario4(@QueryParams() params: QueryParamModel, @QueryParams("locale") locale: string) {}
}

describe("Swagger query params", () => {
  let request: SuperTest.Agent;
  beforeEach(
    PlatformTest.bootstrap(Server, {
      adapter: PlatformExpress,
      mount: {
        "/rest": [QueryParamsSwaggerController]
      }
    })
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterEach(PlatformTest.reset);

  it("should generate swagger", async () => {
    const response = await request.get("/v3/doc/swagger.json").expect(200);

    expect(response.body).toEqual({
      info: {
        title: "Api documentation",
        version: "1.0.0"
      },
      openapi: "3.0.1",
      paths: {
        "/rest/scenarios/1": {
          get: {
            operationId: "queryParamsSwaggerControllerScenario1",
            parameters: [
              {
                in: "query",
                name: "id",
                required: false,
                schema: {
                  type: "string"
                }
              }
            ],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["QueryParamsSwaggerController"]
          }
        },
        "/rest/scenarios/2": {
          get: {
            operationId: "queryParamsSwaggerControllerScenario2",
            parameters: [
              {
                in: "query",
                name: "ids",
                required: false,
                schema: {
                  items: {
                    type: "string"
                  },
                  type: "array"
                }
              }
            ],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["QueryParamsSwaggerController"]
          }
        },
        "/rest/scenarios/3": {
          get: {
            operationId: "queryParamsSwaggerControllerScenario3",
            parameters: [
              {
                in: "query",
                name: "ids",
                required: false,
                schema: {
                  additionalProperties: {
                    type: "string"
                  },
                  type: "object"
                }
              }
            ],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["QueryParamsSwaggerController"]
          }
        },
        "/rest/scenarios/4": {
          get: {
            operationId: "queryParamsSwaggerControllerScenario4",
            parameters: [
              {
                in: "query",
                name: "name",
                required: true,
                schema: {
                  minLength: 1,
                  type: "string"
                }
              },
              {
                in: "query",
                name: "duration",
                required: false,
                schema: {
                  type: "number"
                }
              },
              {
                in: "query",
                name: "locale",
                required: false,
                schema: {
                  type: "string"
                }
              }
            ],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["QueryParamsSwaggerController"]
          }
        }
      },
      tags: [
        {
          name: "QueryParamsSwaggerController"
        }
      ]
    });

    await request.get("/rest/scenarios/4?name=name&duration=1&locale=fr-FR");
  });
});
