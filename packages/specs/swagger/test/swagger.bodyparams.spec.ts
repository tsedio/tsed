import {BodyParams, Controller, PlatformTest, Post} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {MaxLength, MinLength} from "@tsed/schema";
import {expect} from "chai";
import SuperTest from "supertest";
import {Server} from "./app/Server";

@Controller({
  path: "/customers"
})
class CustomerController {
  @Post("/")
  async get(
    @BodyParams("customer_name") customerName: string,
    @BodyParams("customer_last_name") @MinLength(0) @MaxLength(100) customerLastName: string
  ): Promise<string> {
    return "";
  }
}

describe("Swagger BodyParams()", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  beforeEach(
    PlatformTest.bootstrap(Server, {
      platform: PlatformExpress,
      mount: {
        "/rest": [CustomerController]
      }
    })
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterEach(PlatformTest.reset);

  describe("OpenSpec2", () => {
    it("should swagger spec", async () => {
      const response = await request.get("/v2/doc/swagger.json").expect(200);

      expect(response.body).to.deep.eq({
        "consumes": [
          "application/json"
        ],
        "info": {
          "title": "Swagger title",
          "version": "1.2.0"
        },
        "paths": {
          "/rest/customers": {
            "post": {
              "operationId": "customerControllerGet",
              "parameters": [
                {
                  "in": "body",
                  "name": "body",
                  "required": false,
                  "schema": {
                    "properties": {
                      "customer_name": {
                        "type": "string"
                      },
                      "customer_last_name": {
                        "maxLength": 100,
                        "minLength": 0,
                        "type": "string"
                      }
                    },
                    "type": "object"
                  }
                }
              ],
              "responses": {
                "200": {
                  "description": "Success"
                }
              },
              "tags": [
                "CustomerController"
              ]
            }
          }
        },
        "produces": [
          "application/json"
        ],
        "swagger": "2.0",
        "tags": [
          {
            "name": "CustomerController"
          }
        ]
      });
    });
  });
  describe("OpenSpec3", () => {
    it("should swagger spec", async () => {
      const response = await request.get("/v3/doc/swagger.json").expect(200);

      expect(response.body).to.deep.eq({
        "info": {
          "title": "Api documentation",
          "version": "1.0.0"
        },
        "openapi": "3.0.1",
        "paths": {
          "/rest/customers": {
            "post": {
              "operationId": "customerControllerGet",
              "parameters": [],
              "requestBody": {
                "content": {
                  "application/json": {
                    "schema": {
                      "properties": {
                        "customer_last_name": {
                          "maxLength": 100,
                          "minLength": 0,
                          "type": "string"
                        },
                        "customer_name": {
                          "type": "string"
                        }
                      },
                      "type": "object"
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
                "CustomerController"
              ]
            }
          }
        },
        "tags": [
          {
            "name": "CustomerController"
          }
        ]
      });
    });
  });
});
