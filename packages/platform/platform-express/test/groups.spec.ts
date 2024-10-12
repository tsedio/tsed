import "@tsed/ajv";

import {Controller} from "@tsed/di";
import {deserialize} from "@tsed/json-mapper";
import {PlatformTest} from "@tsed/platform-http/testing";
import {BodyParams, PathParams} from "@tsed/platform-params";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {Get, getSpec, Groups, Post, Property, Put, Returns, SpecTypes} from "@tsed/schema";
import SuperTest from "supertest";

import {PlatformExpress} from "../src/index.js";
import {rootDir, Server} from "./app/Server.js";

class Product {
  @Groups("!creation")
  id: string;

  @Property()
  label: string;

  @Groups("group.summary")
  price: number;

  @Groups("group.extended")
  description: string;
}

const utils = PlatformTestSdk.create({
  rootDir,
  platform: PlatformExpress,
  server: Server
});

@Controller("/groups")
class TestGroupsCtrl {
  @Post("/")
  @(Returns(201, Product).Groups("group.*"))
  create(@BodyParams() @Groups("creation") payload: Product) {
    return deserialize(
      {
        ...payload,
        id: payload.id || "newId"
      },
      {type: Product}
    );
  }

  @Put("/:id")
  @Returns(200, Product)
  update(@BodyParams() @Groups("group.*") payload: Product, @PathParams("id") id: string) {
    expect(typeof payload.id).toBe("string");

    return payload;
  }

  @Get("/:id")
  @(Returns(200, Product).Groups("group.summary"))
  get(@PathParams("id") id: string) {
    return deserialize(
      {
        id,
        label: "label",
        price: 100,
        description: "description"
      },
      {type: Product}
    );
  }
}

describe("Groups", () => {
  let request: SuperTest.Agent;

  beforeAll(
    utils.bootstrap({
      mount: {
        "/rest": [TestGroupsCtrl]
      },
      swagger: [
        {
          path: "/v2/docs",
          specVersion: "2.0" // by default
        },
        {
          path: "/v3/docs",
          specVersion: "3.0.1"
        }
      ]
    })
  );
  afterAll(() => utils.reset());

  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });

  it("should generate spec", () => {
    const spec = getSpec(TestGroupsCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      components: {
        schemas: {
          Product: {
            properties: {
              id: {
                type: "string"
              },
              label: {
                type: "string"
              }
            },
            type: "object"
          },
          ProductCreation: {
            properties: {
              label: {
                type: "string"
              }
            },
            type: "object"
          },
          ProductGroup: {
            properties: {
              description: {
                type: "string"
              },
              id: {
                type: "string"
              },
              label: {
                type: "string"
              },
              price: {
                type: "number"
              }
            },
            type: "object"
          },
          ProductGroupSummary: {
            properties: {
              id: {
                type: "string"
              },
              label: {
                type: "string"
              },
              price: {
                type: "number"
              }
            },
            type: "object"
          }
        }
      },
      paths: {
        "/groups": {
          post: {
            operationId: "testGroupsCtrlCreate",
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ProductCreation"
                  }
                }
              },
              required: false
            },
            responses: {
              "201": {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ProductGroup"
                    }
                  }
                },
                description: "Created"
              }
            },
            tags: ["TestGroupsCtrl"]
          }
        },
        "/groups/{id}": {
          get: {
            operationId: "testGroupsCtrlGet",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: {
                  type: "string"
                }
              }
            ],
            responses: {
              "200": {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ProductGroupSummary"
                    }
                  }
                },
                description: "Success"
              }
            },
            tags: ["TestGroupsCtrl"]
          },
          put: {
            operationId: "testGroupsCtrlUpdate",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: {
                  type: "string"
                }
              }
            ],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ProductGroup"
                  }
                }
              },
              required: false
            },
            responses: {
              "200": {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Product"
                    }
                  }
                },
                description: "Success"
              }
            },
            tags: ["TestGroupsCtrl"]
          }
        }
      },
      tags: [
        {
          name: "TestGroupsCtrl"
        }
      ]
    });
  });

  describe("POST /rest/groups", () => {
    it("should create product according to the model groups configuration", async () => {
      const {body} = await request
        .post("/rest/groups")
        .send({
          label: "label",
          price: 100,
          description: "description"
        })
        .expect(201);

      expect(body).toEqual({
        id: "newId",
        label: "label"
      });
    });
    it("should doesn't deserialize extra fields", async () => {
      const {body} = await request
        .post("/rest/groups")
        .send({
          id: "newId",
          label: "label",
          price: 100,
          description: "description"
        })
        .expect(201);

      expect(body).toEqual({
        id: "newId",
        label: "label"
      });
    });
  });

  describe("GET /rest/groups/:id", () => {
    it("should get product with only summary group fields", async () => {
      const {body} = await request.get("/rest/groups/1").expect(200);

      expect(body).toEqual({
        id: "1",
        label: "label",
        price: 100
      });
    });
  });
});
