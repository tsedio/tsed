import {Controller, Get, MergeParams, PathParams, PlatformTest} from "@tsed/common";
import {Description, Returns} from "@tsed/schema";
import {Docs, Hidden} from "@tsed/swagger";
import {expect} from "chai";
import * as SuperTest from "supertest";
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
  @Returns(200, Calendar)
  async get(@PathParams("id") id: string): Promise<Calendar> {
    return new Calendar({id, name: "test"});
  }

  @Get("/")
  @Returns(200, Array).Of(Calendar)
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
              "minLength": 1,
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
            "operationId": "calendarsControllerGetAll",
            "parameters": [],
            "produces": [
              "application/json"
            ],
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
        "/rest/calendars/{id}": {
          "get": {
            "operationId": "calendarsControllerGet",
            "parameters": [
              {
                "in": "path",
                "name": "id",
                "required": true,
                "type": "string"
              }
            ],
            "produces": [
              "application/json"
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
        },
        "/rest/events/events": {
          "get": {
            "description": "Events",
            "operationId": "eventCtrlGet",
            "parameters": [],
            "responses": {
              "200": {
                "description": "Success"
              }
            },
            "tags": [
              "EventCtrl"
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
          "name": "EventCtrl"
        },
        {
          "name": "CalendarsController"
        }
      ]
    });
  });
});
