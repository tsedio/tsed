import "@tsed/ajv";
import {BodyParams, Controller, PlatformTest, Post} from "@tsed/common";
import {PlatformTestUtils} from "@tsed/platform-test-utils";
import {CollectionOf, Property, Any} from "@tsed/schema";
import {expect} from "chai";
import SuperTest from "supertest";
import {PlatformExpress} from "../src";
import {rootDir, Server} from "./app/Server";

const utils = PlatformTestUtils.create({
  rootDir,
  platform: PlatformExpress,
  server: Server
});

class MyModel {
  @Property()
  test: string;
}

@Controller("/array")
class TestArrayBodyCtrl {
  @Post("/1")
  async scenario1(@BodyParams() list: any[]) {
    return list;
  }

  @Post("/2")
  async scenario2(@BodyParams() list: number[]) {
    return list;
  }

  @Post("/3")
  async scenario3(@BodyParams() @CollectionOf(Number) list: number[]) {
    return list;
  }

  @Post("/4")
  async scenario4(@BodyParams() @CollectionOf(MyModel) list: MyModel[]) {
    return list;
  }

  @Post("/5")
  async scenario5(@BodyParams() list: any) {
    return list;
  }

  @Post("/6")
  async scenario6(@BodyParams() @Any() list: any) {
    return list;
  }
}

describe("Array Body", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    utils.bootstrap({
      mount: {
        "/rest": [TestArrayBodyCtrl]
      },
      swagger: [
        {
          path: "/v3/docs",
          specVersion: "3.0.1"
        }
      ]
    })
  );
  after(utils.reset);

  before(() => {
    request = SuperTest(PlatformTest.callback());
  });

  describe("swagger", () => {
    it("should return the swagger", async () => {
      const {body} = await request.get("/v3/docs/swagger.json").expect(200);

      expect(body).to.deep.eq({
        "components": {
          "schemas": {
            "MyModel": {
              "properties": {
                "test": {
                  "type": "string"
                }
              },
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
          "/rest/array/1": {
            "post": {
              "operationId": "testArrayBodyCtrlScenario1",
              "parameters": [],
              "requestBody": {
                "content": {
                  "application/json": {
                    "schema": {
                      "items": {
                        "oneOf": [
                          {
                            "nullable": true,
                            "type": "integer"
                          },
                          {
                            "nullable": true,
                            "type": "number"
                          },
                          {
                            "nullable": true,
                            "type": "string"
                          },
                          {
                            "nullable": true,
                            "type": "boolean"
                          },
                          {
                            "nullable": true,
                            "type": "array"
                          },
                          {
                            "nullable": true,
                            "type": "object"
                          }
                        ]
                      },
                      "type": "array"
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
                "TestArrayBodyCtrl"
              ]
            }
          },
          "/rest/array/2": {
            "post": {
              "operationId": "testArrayBodyCtrlScenario2",
              "parameters": [],
              "requestBody": {
                "content": {
                  "application/json": {
                    "schema": {
                      "items": {
                        "oneOf": [
                          {
                            "nullable": true,
                            "type": "integer"
                          },
                          {
                            "nullable": true,
                            "type": "number"
                          },
                          {
                            "nullable": true,
                            "type": "string"
                          },
                          {
                            "nullable": true,
                            "type": "boolean"
                          },
                          {
                            "nullable": true,
                            "type": "array"
                          },
                          {
                            "nullable": true,
                            "type": "object"
                          }
                        ]
                      },
                      "type": "array"
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
                "TestArrayBodyCtrl"
              ]
            }
          },
          "/rest/array/3": {
            "post": {
              "operationId": "testArrayBodyCtrlScenario3",
              "parameters": [],
              "requestBody": {
                "content": {
                  "application/json": {
                    "schema": {
                      "items": {
                        "type": "number"
                      },
                      "type": "array"
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
                "TestArrayBodyCtrl"
              ]
            }
          },
          "/rest/array/4": {
            "post": {
              "operationId": "testArrayBodyCtrlScenario4",
              "parameters": [],
              "requestBody": {
                "content": {
                  "application/json": {
                    "schema": {
                      "items": {
                        "$ref": "#/components/schemas/MyModel"
                      },
                      "type": "array"
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
                "TestArrayBodyCtrl"
              ]
            }
          },
          "/rest/array/5": {
            "post": {
              "operationId": "testArrayBodyCtrlScenario5",
              "parameters": [],
              "requestBody": {
                "content": {
                  "application/json": {
                    "schema": {
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
                "TestArrayBodyCtrl"
              ]
            }
          },
          "/rest/array/6": {
            "post": {
              "operationId": "testArrayBodyCtrlScenario6",
              "parameters": [],
              "requestBody": {
                "content": {
                  "application/json": {
                    "schema": {
                      "oneOf": [
                        {
                          "nullable": true,
                          "type": "integer"
                        },
                        {
                          "nullable": true,
                          "type": "number"
                        },
                        {
                          "nullable": true,
                          "type": "string"
                        },
                        {
                          "nullable": true,
                          "type": "boolean"
                        },
                        {
                          "nullable": true,
                          "type": "array"
                        },
                        {
                          "nullable": true,
                          "type": "object"
                        }
                      ]
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
                "TestArrayBodyCtrl"
              ]
            }
          }
        },
        "tags": [
          {
            "name": "TestArrayBodyCtrl"
          }
        ]
      });
    });
  });

  describe("POST /rest/array/1", () => {
    it("should return list", async () => {
      const {body} = await request.post("/rest/array/1")
        .send([{test: "test"}])
        .expect(200);

      expect(body).to.deep.eq([
        {
          "test": "test"
        }
      ]);
    });
  });
  describe("POST /rest/array/2", () => {
    it("should return list", async () => {
      const {body} = await request.post("/rest/array/2")
        .send([{test: 1}])
        .expect(200);

      expect(body).to.deep.eq([
        {
          "test": 1
        }
      ]);
    });
  });

  describe("POST /rest/array/3", () => {
    it("should return list", async () => {
      const {body} = await request.post("/rest/array/3")
        .send([1])
        .expect(200);

      expect(body).to.deep.eq([
        1
      ]);
    });
  });

  describe("POST /rest/array/4", () => {
    it("should return list", async () => {
      const {body} = await request.post("/rest/array/4")
        .send([{test: "1"}])
        .expect(200);

      expect(body).to.deep.eq([
        {
          "test": "1"
        }
      ]);
    });
  });
  describe("POST /rest/array/5", () => {
    it("should throw a bad request", async () => {
      const {body} = await request.post("/rest/array/5")
        .send([{test: "1"}])
        .expect(400);

      expect(body).to.deep.eq({
        "errors": [
          {
            "data": [
              {
                "test": "1"
              }
            ],
            "dataPath": "",
            "keyword": "type",
            "instancePath": "",
            "message": "must be object",
            "params": {
              "type": "object"
            },
            "schemaPath": "#/type"
          }
        ],
        "message": "Bad request on parameter \"request.body\".\nValue must be object. Given value: [{\"test\":\"1\"}]",
        "name": "AJV_VALIDATION_ERROR",
        "status": 400
      });
    });
  });
});
