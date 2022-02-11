import {BodyParams, Controller, Get, PathParams, PlatformTest, Post} from "@tsed/common";
import {ObjectID} from "@tsed/mongoose";
import {MergeParams, PlatformExpress} from "@tsed/platform-express";
import {Consumes, Description, Returns} from "@tsed/schema";
import {Docs, Hidden} from "@tsed/swagger";
import {expect} from "chai";
import SuperTest from "supertest";
import {Calendar} from "./app/models/Calendar";
import {Server} from "./app/Server";

@Controller("/admin")
@Hidden()
class AdminCtrl {
  @Get("/")
  get() {}
}

@Controller("/events")
@MergeParams(true)
class EventCtrl {
  @Get("/")
  @Description("Events")
  get() {}
}

@Controller("/admin")
@Docs("admin")
class BackAdminCtrl {
  @Get("/")
  @Description("Admins")
  get() {}
}

@Controller({
  path: "/calendars",
  children: [AdminCtrl, EventCtrl]
})
class CalendarsController {
  @Get("/:id")
  @Returns(200, Calendar)
  async get(@PathParams("id") @ObjectID() id: string): Promise<Calendar> {
    return new Calendar({id, name: "test"});
  }

  @Get("/")
  @Returns(200, Array).Of(Calendar)
  async getAll(): Promise<Calendar[]> {
    return [new Calendar({id: 1, name: "name"}), new Calendar({id: 2, name: "name"})];
  }

  @Post("/csv")
  @Consumes("text/plain")
  @Returns(200, String).ContentType("text/plain")
  async csv(@BodyParams() csvLines: string): Promise<string> {
    return "";
  }
}

describe("Swagger integration", () => {
  describe("OpenSpec", () => {
    let request: SuperTest.SuperTest<SuperTest.Test>;
    beforeEach(
      PlatformTest.bootstrap(Server, {
        platform: PlatformExpress,
        swagger: [
          {
            path: "/v2/doc",
            specVersion: "2.0",
            showExplorer: true,
            operationIdPattern: "%c_%m",
            spec: {
              info: {
                title: "Swagger title",
                version: "1.2.0"
              }
            }
          },
          {
            path: "/v3/doc",
            specVersion: "3.0.1",
            operationIdFormatter(name: string, propertyKey, path: string) {
              return name + "__" + propertyKey;
            },
            showExplorer: true
          }
        ],
        mount: {
          "/rest": [CalendarsController]
        }
      })
    );
    beforeEach(() => {
      request = SuperTest(PlatformTest.callback());
    });
    afterEach(PlatformTest.reset);

    it("should swagger spec 2", async () => {
      const response = await request.get("/v2/doc/swagger.json").expect(200);

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
          title: "Swagger title",
          version: "1.2.0"
        },
        paths: {
          "/rest/calendars": {
            get: {
              operationId: "CalendarsController_getAll",
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
              operationId: "CalendarsController_get",
              parameters: [
                {
                  description: "Mongoose ObjectId",
                  in: "path",
                  name: "id",
                  pattern: "^[0-9a-fA-F]{24}$",
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
          "/rest/calendars/csv": {
            post: {
              operationId: "CalendarsController_csv",
              parameters: [
                {
                  in: "body",
                  name: "body",
                  required: false,
                  type: "string"
                }
              ],
              produces: ["text/plain"],
              consumes: ["text/plain"],
              responses: {
                "200": {
                  description: "Success",
                  schema: {
                    type: "string"
                  }
                }
              },
              tags: ["CalendarsController"]
            }
          },
          "/rest/calendars/events": {
            get: {
              description: "Events",
              operationId: "EventCtrl_get",
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
    it("should swagger spec 3", async () => {
      const response = await request.get("/v3/doc/swagger.json").expect(200);

      expect(response.body).to.deep.eq({
        components: {
          schemas: {
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
          }
        },
        info: {
          title: "Api documentation",
          version: "1.0.0"
        },
        openapi: "3.0.1",
        paths: {
          "/rest/calendars": {
            get: {
              operationId: "CalendarsController__getAll",
              parameters: [],
              responses: {
                "200": {
                  content: {
                    "application/json": {
                      schema: {
                        items: {
                          $ref: "#/components/schemas/Calendar"
                        },
                        type: "array"
                      }
                    }
                  },
                  description: "Success"
                }
              },
              tags: ["CalendarsController"]
            }
          },
          "/rest/calendars/csv": {
            post: {
              operationId: "CalendarsController__csv",
              parameters: [],
              requestBody: {
                content: {
                  "text/plain": {
                    schema: {
                      type: "string"
                    }
                  }
                },
                required: false
              },
              responses: {
                "200": {
                  content: {
                    "text/plain": {
                      schema: {
                        type: "string"
                      }
                    }
                  },
                  description: "Success"
                }
              },
              tags: ["CalendarsController"]
            }
          },
          "/rest/calendars/events": {
            get: {
              description: "Events",
              operationId: "EventCtrl__get",
              parameters: [],
              responses: {
                "200": {
                  description: "Success"
                }
              },
              tags: ["EventCtrl"]
            }
          },
          "/rest/calendars/{id}": {
            get: {
              operationId: "CalendarsController__get",
              parameters: [
                {
                  description: "Mongoose ObjectId",
                  in: "path",
                  name: "id",
                  required: true,
                  schema: {
                    example: "5ce7ad3028890bd71749d477",
                    pattern: "^[0-9a-fA-F]{24}$",
                    type: "string"
                  }
                }
              ],
              responses: {
                "200": {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Calendar"
                      }
                    }
                  },
                  description: "Success"
                }
              },
              tags: ["CalendarsController"]
            }
          }
        },
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
});
