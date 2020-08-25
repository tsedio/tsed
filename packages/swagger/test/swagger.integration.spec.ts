import {Controller, Description, Get, MergeParams, PathParams, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Docs, Hidden, Returns, ReturnsArray} from "../src";
import {Calendar} from "./helpers/models/Calendar";
import {Server} from "./helpers/Server";

@Controller("/admin")
@Hidden()
class AdminCtrl {
  @Get("/")
  get() {
  }
}

@Controller("/events")
@MergeParams(true)
class EventCtrl {
  @Get("/")
  @Description("Events")
  get() {
  }
}

@Controller("/admin")
@Docs("admin")
class BackAdminCtrl {
  @Get("/")
  @Description("Admins")
  get() {
  }
}

@Controller({
  path: "/calendars",
  children: [
    AdminCtrl,
    EventCtrl
  ]
})
class CalendarsController {
  @Get("/:id")
  @Returns(200, {type: Calendar})
  async get(@PathParams("id") id: string): Promise<Calendar> {
    return new Calendar({id, name: "test"});
  }

  @Get("/")
  @ReturnsArray(200, {type: Calendar})
  async getAll(): Promise<Calendar[]> {
    return [
      new Calendar({id: 1, name: "name"}),
      new Calendar({id: 2, name: "name"})
    ];
  }
}

describe("Swagger integration", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  beforeEach(PlatformTest.bootstrap(Server, {
    mount: {
      "/rest": [CalendarsController]
    }
  }));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterEach(PlatformTest.reset);

  it("should swagger spec", async () => {
    const response = await request.get("/api-doc/swagger.json").expect(200);
    const result = await request.get("/rest/calendars").expect(200);

    expect(result.body).to.deep.eq([
      {
        "id": 1,
        "name": "name"
      },
      {
        "id": 2,
        "name": "name"
      }
    ]);
    expect(response.body).to.deep.eq({
      "swagger": "2.0",
      "tags": [
        {
          "name": "CalendarsController"
        },
        {
          "name": "EventCtrl"
        }
      ],
      "consumes": [
        "application/json"
      ],
      "definitions": {
        "Calendar": {
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            }
          },
          "required": [
            "name"
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
        "/rest/calendars": {
          "get": {
            "operationId": "CalendarsController.getAll",
            "responses": {
              "200": {
                "description": "Success",
                "schema": {
                  "items": {
                    "$ref": "#/definitions/Calendar"
                  },
                  "type": "array"
                }
              }
            },
            "tags": [
              "CalendarsController"
            ]
          }
        },
        "/rest/calendars/events": {
          "get": {
            "description": "Events",
            "operationId": "EventCtrl.get",
            "responses": {
              "200": {
                "description": "Success"
              }
            },
            "tags": [
              "EventCtrl"
            ]
          }
        },
        "/rest/calendars/{id}": {
          "get": {
            "operationId": "CalendarsController.get",
            "parameters": [
              {
                "in": "path",
                "name": "id",
                "required": true,
                "type": "string"
              }
            ],
            "responses": {
              "200": {
                "description": "Success",
                "schema": {
                  "$ref": "#/definitions/Calendar"
                }
              }
            },
            "tags": [
              "CalendarsController"
            ]
          }
        }
      },
      "produces": [
        "application/json"
      ],
      "securityDefinitions": {}
    });
  });
});
