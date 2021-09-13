import {Controller, Get, PathParams, PlatformTest} from "@tsed/common";
import {ObjectID} from "@tsed/mongoose";
import {PlatformExpress} from "@tsed/platform-express";
import {AnyOf, Required, Returns} from "@tsed/schema";
import {expect} from "chai";
import SuperTest from "supertest";
import {Server} from "./app/Server";

export class ListAbandonTask {
  @Required()
  id: number;
}

export class ListCallRequestTask {
  @Required()
  id: number;
}

export class ListTasks {
  @Required()
  @AnyOf(ListAbandonTask, ListCallRequestTask)
  tasks: (ListAbandonTask | ListCallRequestTask)[];
}

@Controller({
  path: "/tasks"
})
class ListTasksController {
  @Get("/:id")
  @Returns(200, ListTasks)
  async get(@PathParams("id") @ObjectID() id: string): Promise<ListTasks> {
    return new ListTasks();
  }
}

describe("Swagger AnyOf()", () => {
  describe("OpenSpec3", () => {
    let request: SuperTest.SuperTest<SuperTest.Test>;
    beforeEach(
      PlatformTest.bootstrap(Server, {
        platform: PlatformExpress,
        mount: {
          "/rest": [ListTasksController]
        }
      })
    );
    beforeEach(() => {
      request = SuperTest(PlatformTest.callback());
    });
    afterEach(PlatformTest.reset);

    it("should swagger spec", async () => {
      const response = await request.get("/v3/doc/swagger.json").expect(200);

      expect(response.body).to.deep.eq({
        "components": {
          "schemas": {
            "ListAbandonTask": {
              "properties": {
                "id": {
                  "type": "number"
                }
              },
              "required": [
                "id"
              ],
              "type": "object"
            },
            "ListCallRequestTask": {
              "properties": {
                "id": {
                  "type": "number"
                }
              },
              "required": [
                "id"
              ],
              "type": "object"
            },
            "ListTasks": {
              "properties": {
                "tasks": {
                  "items": {
                    "anyOf": [
                      {
                        "$ref": "#/components/schemas/ListAbandonTask"
                      },
                      {
                        "$ref": "#/components/schemas/ListCallRequestTask"
                      }
                    ]
                  },
                  "type": "array"
                }
              },
              "required": [
                "tasks"
              ],
              "type": "object"
            }
          }
        },
        "info": {
          "title": "Api documentation",
          "version": "1.0.0"
        },
        "openapi": "3.0.1",
        "paths": {
          "/rest/tasks/{id}": {
            "get": {
              "operationId": "listTasksControllerGet",
              "parameters": [
                {
                  "description": "Mongoose ObjectId",
                  "in": "path",
                  "name": "id",
                  "required": true,
                  "schema": {
                    "example": "5ce7ad3028890bd71749d477",
                    "pattern": "^[0-9a-fA-F]{24}$",
                    "type": "string"
                  }
                }
              ],
              "responses": {
                "200": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/ListTasks"
                      }
                    }
                  },
                  "description": "Success"
                }
              },
              "tags": [
                "ListTasksController"
              ]
            }
          }
        },
        "tags": [
          {
            "name": "ListTasksController"
          }
        ]
      });
    });
  });
});
