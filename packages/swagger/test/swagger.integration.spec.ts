import {Controller, Get, PathParams, PlatformTest} from "@tsed/common";
import {MergeParams, PlatformExpress} from "@tsed/platform-express";
import {Description, Returns} from "@tsed/schema";
import {Docs, Hidden} from "@tsed/swagger";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Calendar} from "./app/models/Calendar";
import {Server} from "./app/Server";

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
  children: [AdminCtrl, EventCtrl]
})
class CalendarsController {
  @Get("/:id")
  @Returns(200, Calendar)
  async get(@PathParams("id") id: string): Promise<Calendar> {
    return new Calendar({id, name: "test"});
  }

  @Get("/")
  @(Returns(200, Array).Of(Calendar))
  async getAll(): Promise<Calendar[]> {
    return [new Calendar({id: 1, name: "name"}), new Calendar({id: 2, name: "name"})];
  }
}

describe("Swagger integration", () => {
  describe("swagger 2", () => {
    let request: SuperTest.SuperTest<SuperTest.Test>;
    beforeEach(
      PlatformTest.bootstrap(Server, {
        platform: PlatformExpress,
        mount: {
          "/rest": [CalendarsController]
        }
      })
    );
    beforeEach(() => {
      request = SuperTest(PlatformTest.callback());
    });
    afterEach(PlatformTest.reset);

    it("should swagger spec", async () => {
      const response = await request.get("/v2/doc/swagger.json").expect(200);
      const result = await request.get("/rest/calendars").expect(200);

      expect(result.body).to.deep.eq([
        {
          id: 1,
          name: "name"
        },
        {
          id: 2,
          name: "name"
        }
      ]);
      expect(response.body).to.deep.eq({
        consumes: ["application/json"],
        definitions: {
          Calendar: {
            properties: {
              id: {
                type: "string"
              },
              name: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["name"],
            type: "object"
          }
        },
        info: {
          description: "",
          termsOfService: "",
          title: "Api documentation",
          version: "1.0.0"
        },
        paths: {
          "/rest/calendars": {
            get: {
              operationId: "calendarsControllerGetAll",
              parameters: [],
              produces: ["application/json"],
              responses: {
                "200": {
                  description: "Success",
                  schema: {
                    items: {
                      $ref: "#/definitions/Calendar"
                    },
                    type: "array"
                  }
                }
              },
              tags: ["CalendarsController"]
            }
          },
          "/rest/calendars/{id}": {
            get: {
              operationId: "calendarsControllerGet",
              parameters: [
                {
                  in: "path",
                  name: "id",
                  required: true,
                  type: "string"
                }
              ],
              produces: ["application/json"],
              responses: {
                "200": {
                  description: "Success",
                  schema: {
                    $ref: "#/definitions/Calendar"
                  }
                }
              },
              tags: ["CalendarsController"]
            }
          },
          "/rest/events/events": {
            get: {
              description: "Events",
              operationId: "eventCtrlGet",
              parameters: [],
              responses: {
                "200": {
                  description: "Success"
                }
              },
              tags: ["EventCtrl"]
            }
          }
        },
        produces: ["application/json"],
        securityDefinitions: {},
        swagger: "2.0",
        tags: [
          {
            name: "EventCtrl"
          },
          {
            name: "CalendarsController"
          }
        ]
      });
    });
  });
  describe("OpenSpec3", () => {
    let request: SuperTest.SuperTest<SuperTest.Test>;
    beforeEach(
      PlatformTest.bootstrap(Server, {
        platform: PlatformExpress,
        mount: {
          "/rest": [CalendarsController]
        }
      })
    );
    beforeEach(() => {
      request = SuperTest(PlatformTest.callback());
    });
    afterEach(PlatformTest.reset);

    it("should swagger spec", async () => {
      const response = await request.get("/v3/doc/swagger.json").expect(200);
      const result = await request.get("/rest/calendars").expect(200);

      expect(result.body).to.deep.eq([
        {
          id: 1,
          name: "name"
        },
        {
          id: 2,
          name: "name"
        }
      ]);

      expect(response.body).to.deep.eq({
        "info": {"version": "1.0.0", "title": "Api documentation", "description": "", "termsOfService": ""},
        "openapi": "3.0.1",
        "securityDefinitions": {},
        "paths": {
          "/rest/events/events": {
            "get": {
              "operationId": "eventCtrlGet",
              "parameters": [],
              "responses": {"200": {"description": "Success"}},
              "description": "Events",
              "tags": ["EventCtrl"]
            }
          },
          "/rest/calendars/{id}": {
            "get": {
              "operationId": "calendarsControllerGet",
              "parameters": [{"in": "path", "name": "id", "required": true, "schema": {"type": "string"}}],
              "responses": {
                "200": {
                  "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Calendar"}}},
                  "description": "Success"
                }
              },
              "tags": ["CalendarsController"]
            }
          },
          "/rest/calendars": {
            "get": {
              "operationId": "calendarsControllerGetAll",
              "parameters": [],
              "responses": {
                "200": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/Calendar"}
                      }
                    }
                  }, "description": "Success"
                }
              },
              "tags": ["CalendarsController"]
            }
          }
        },
        "tags": [{"name": "EventCtrl"}, {"name": "CalendarsController"}],
        "components": {
          "schemas": {
            "Calendar": {
              "type": "object",
              "properties": {"id": {"type": "string"}, "name": {"type": "string", "minLength": 1}},
              "required": ["name"]
            }
          }
        }
      });
    });
  });
});
