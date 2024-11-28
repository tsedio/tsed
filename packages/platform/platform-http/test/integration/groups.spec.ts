import "@tsed/ajv";

import {Configuration, Controller} from "@tsed/di";
import {JsonMapperSettings} from "@tsed/json-mapper";
import {PlatformExpress} from "@tsed/platform-express";
import {BodyParams} from "@tsed/platform-params";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {Get, getSpec, Groups, Post, Property, Required, Returns, SpecTypes} from "@tsed/schema";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import SuperTest from "supertest";

import {PlatformTest} from "../../src/testing/index.js";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build

class MyModel {
  @Groups("!creation")
  id: string;

  @Groups("group.summary")
  @Required()
  prop1: string;

  @Groups("group.extended")
  @Required()
  prop2: string;

  @Property()
  @Required()
  prop3: string;

  constructor(opts: Partial<MyModel>) {
    Object.assign(this, opts);
  }
}

@Controller("/groups")
class GroupsIntegrationController {
  @Get("/scenario-1")
  @Returns(200, MyModel)
  scenario1() {
    return new MyModel({
      id: "id",
      prop1: "prop1",
      prop2: "prop2",
      prop3: "prop3"
    });
  }

  @Get("/scenario-2")
  @(Returns(200, MyModel).Groups("summary"))
  scenario2() {
    return new MyModel({
      id: "id",
      prop1: "prop1",
      prop2: "prop2",
      prop3: "prop3"
    });
  }

  @Get("/scenario-3")
  @(Returns(200, MyModel).Groups("creation"))
  scenario3() {
    return new MyModel({
      id: "id",
      prop1: "prop1",
      prop2: "prop2",
      prop3: "prop3"
    });
  }

  @Post("/scenario-4")
  scenario4(@BodyParams() model: MyModel) {
    return {...model};
  }

  @Post("/scenario-5")
  scenario5(@BodyParams() @Groups("group.summary") model: MyModel) {
    return {...model};
  }

  @Post("/scenario-6")
  @Returns(201, MyModel)
  scenario6(@BodyParams() model: MyModel) {
    return model;
  }
}

@Configuration({
  port: 8081,
  middlewares: [cookieParser(), compress({}), methodOverride(), bodyParser.json()],
  mount: {
    "/rest": [GroupsIntegrationController]
  }
})
export class Server {}

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformExpress,
  server: Server,
  logger: {
    level: "off"
  }
});

describe("Groups", () => {
  let request: SuperTest.Agent;
  describe("jsonMapper.strictGroups = false", () => {
    beforeEach(
      utils.bootstrap({
        jsonMapper: {
          disableUnsecureConstructor: true
        }
      })
    );
    beforeEach(() => {
      request = SuperTest(PlatformTest.callback());
    });

    afterEach(utils.reset);

    describe("OS3", () => {
      it("should return open spec", () => {
        const response = getSpec(GroupsIntegrationController, {specType: SpecTypes.OPENAPI});

        expect(response).toEqual({
          components: {
            schemas: {
              MyModel: {
                properties: {
                  id: {
                    type: "string"
                  },
                  prop3: {
                    minLength: 1,
                    type: "string"
                  }
                },
                required: ["prop3"],
                type: "object"
              },
              MyModelCreation: {
                properties: {
                  prop3: {
                    minLength: 1,
                    type: "string"
                  }
                },
                required: ["prop3"],
                type: "object"
              },
              MyModelGroupSummary: {
                properties: {
                  id: {
                    type: "string"
                  },
                  prop1: {
                    minLength: 1,
                    type: "string"
                  },
                  prop3: {
                    minLength: 1,
                    type: "string"
                  }
                },
                required: ["prop1", "prop3"],
                type: "object"
              },
              MyModelSummary: {
                properties: {
                  id: {
                    type: "string"
                  },
                  prop3: {
                    minLength: 1,
                    type: "string"
                  }
                },
                required: ["prop3"],
                type: "object"
              }
            }
          },
          paths: {
            "/groups/scenario-1": {
              get: {
                operationId: "groupsIntegrationControllerScenario1",
                parameters: [],
                responses: {
                  "200": {
                    content: {
                      "application/json": {
                        schema: {
                          $ref: "#/components/schemas/MyModel"
                        }
                      }
                    },
                    description: "Success"
                  }
                },
                tags: ["GroupsIntegrationController"]
              }
            },
            "/groups/scenario-2": {
              get: {
                operationId: "groupsIntegrationControllerScenario2",
                parameters: [],
                responses: {
                  "200": {
                    content: {
                      "application/json": {
                        schema: {
                          $ref: "#/components/schemas/MyModelSummary"
                        }
                      }
                    },
                    description: "Success"
                  }
                },
                tags: ["GroupsIntegrationController"]
              }
            },
            "/groups/scenario-3": {
              get: {
                operationId: "groupsIntegrationControllerScenario3",
                parameters: [],
                responses: {
                  "200": {
                    content: {
                      "application/json": {
                        schema: {
                          $ref: "#/components/schemas/MyModelCreation"
                        }
                      }
                    },
                    description: "Success"
                  }
                },
                tags: ["GroupsIntegrationController"]
              }
            },
            "/groups/scenario-4": {
              post: {
                operationId: "groupsIntegrationControllerScenario4",
                parameters: [],
                requestBody: {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/MyModel"
                      }
                    }
                  },
                  required: false
                },
                responses: {
                  "200": {
                    description: "Success"
                  }
                },
                tags: ["GroupsIntegrationController"]
              }
            },
            "/groups/scenario-5": {
              post: {
                operationId: "groupsIntegrationControllerScenario5",
                parameters: [],
                requestBody: {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/MyModelGroupSummary"
                      }
                    }
                  },
                  required: false
                },
                responses: {
                  "200": {
                    description: "Success"
                  }
                },
                tags: ["GroupsIntegrationController"]
              }
            },
            "/groups/scenario-6": {
              post: {
                operationId: "groupsIntegrationControllerScenario6",
                parameters: [],
                requestBody: {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/MyModel"
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
                          $ref: "#/components/schemas/MyModel"
                        }
                      }
                    },
                    description: "Created"
                  }
                },
                tags: ["GroupsIntegrationController"]
              }
            }
          },
          tags: [
            {
              name: "GroupsIntegrationController"
            }
          ]
        });
      });
    });

    describe("scenario: 1", () => {
      it("should returns only props that not decorated by Groups or Groups with negative rule)", async () => {
        const response = await request.get(`/rest/groups/scenario-1`).expect(200);

        expect(response.body).toEqual({
          id: "id",
          prop1: "prop1",
          prop2: "prop2",
          prop3: "prop3"
        });
      });
    });
    describe("scenario: 2", () => {
      it("should returns only props that match the groups rules", async () => {
        const response = await request.get(`/rest/groups/scenario-2`).expect(200);

        expect(response.body).toEqual({
          id: "id",
          prop3: "prop3"
        });
      });
    });
    describe("scenario: 3", () => {
      it("should returns only props that match the groups (negative condition)", async () => {
        const response = await request.get(`/rest/groups/scenario-3`).expect(200);

        expect(response.body).toEqual({
          prop3: "prop3"
        });
      });
    });

    describe("scenario: 4", () => {
      it("should post data with all field", async () => {
        const response = await request
          .post(`/rest/groups/scenario-4`)
          .send({
            id: "id",
            prop1: "prop1",
            prop2: "prop2",
            prop3: "prop3"
          })
          .expect(200);

        expect(response.body).toEqual({
          id: "id",
          prop1: "prop1",
          prop2: "prop2",
          prop3: "prop3"
        });
      });
    });

    describe("scenario: 5", () => {
      it("should post data with defined groups rules", async () => {
        const response = await request
          .post(`/rest/groups/scenario-5`)
          .send({
            id: "id",
            prop1: "prop1",
            prop2: "prop2",
            prop3: "prop3"
          })
          .expect(200);

        expect(response.body).toEqual({
          id: "id",
          prop1: "prop1",
          prop3: "prop3"
        });
      });
    });

    describe("scenario: 6", () => {
      it("should post data with default groups rules", async () => {
        const response = await request
          .post(`/rest/groups/scenario-6`)
          .send({
            id: "id",
            prop1: "prop1",
            prop2: "prop2",
            prop3: "prop3"
          })
          .expect(201);

        expect(response.body).toEqual({
          id: "id",
          prop1: "prop1",
          prop2: "prop2",
          prop3: "prop3"
        });
      });
    });
  });
  describe("jsonMapper.strictGroups = true", () => {
    beforeEach(
      utils.bootstrap({
        jsonMapper: {
          disableUnsecureConstructor: true,
          strictGroups: true
        }
      })
    );
    beforeEach(() => {
      request = SuperTest(PlatformTest.callback());
    });

    afterEach(utils.reset);
    afterEach(() => {
      JsonMapperSettings.strictGroups = false;
    });

    describe("OS3", () => {
      it("should return open spec", () => {
        const response = getSpec(GroupsIntegrationController, {specType: SpecTypes.OPENAPI});

        expect(response).toEqual({
          components: {
            schemas: {
              MyModel: {
                properties: {
                  id: {
                    type: "string"
                  },
                  prop3: {
                    minLength: 1,
                    type: "string"
                  }
                },
                required: ["prop3"],
                type: "object"
              },
              MyModelCreation: {
                properties: {
                  prop3: {
                    minLength: 1,
                    type: "string"
                  }
                },
                required: ["prop3"],
                type: "object"
              },
              MyModelGroupSummary: {
                properties: {
                  id: {
                    type: "string"
                  },
                  prop1: {
                    minLength: 1,
                    type: "string"
                  },
                  prop3: {
                    minLength: 1,
                    type: "string"
                  }
                },
                required: ["prop1", "prop3"],
                type: "object"
              },
              MyModelSummary: {
                properties: {
                  id: {
                    type: "string"
                  },
                  prop3: {
                    minLength: 1,
                    type: "string"
                  }
                },
                required: ["prop3"],
                type: "object"
              }
            }
          },
          paths: {
            "/groups/scenario-1": {
              get: {
                operationId: "groupsIntegrationControllerScenario1",
                parameters: [],
                responses: {
                  "200": {
                    content: {
                      "application/json": {
                        schema: {
                          $ref: "#/components/schemas/MyModel"
                        }
                      }
                    },
                    description: "Success"
                  }
                },
                tags: ["GroupsIntegrationController"]
              }
            },
            "/groups/scenario-2": {
              get: {
                operationId: "groupsIntegrationControllerScenario2",
                parameters: [],
                responses: {
                  "200": {
                    content: {
                      "application/json": {
                        schema: {
                          $ref: "#/components/schemas/MyModelSummary"
                        }
                      }
                    },
                    description: "Success"
                  }
                },
                tags: ["GroupsIntegrationController"]
              }
            },
            "/groups/scenario-3": {
              get: {
                operationId: "groupsIntegrationControllerScenario3",
                parameters: [],
                responses: {
                  "200": {
                    content: {
                      "application/json": {
                        schema: {
                          $ref: "#/components/schemas/MyModelCreation"
                        }
                      }
                    },
                    description: "Success"
                  }
                },
                tags: ["GroupsIntegrationController"]
              }
            },
            "/groups/scenario-4": {
              post: {
                operationId: "groupsIntegrationControllerScenario4",
                parameters: [],
                requestBody: {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/MyModel"
                      }
                    }
                  },
                  required: false
                },
                responses: {
                  "200": {
                    description: "Success"
                  }
                },
                tags: ["GroupsIntegrationController"]
              }
            },
            "/groups/scenario-5": {
              post: {
                operationId: "groupsIntegrationControllerScenario5",
                parameters: [],
                requestBody: {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/MyModelGroupSummary"
                      }
                    }
                  },
                  required: false
                },
                responses: {
                  "200": {
                    description: "Success"
                  }
                },
                tags: ["GroupsIntegrationController"]
              }
            },
            "/groups/scenario-6": {
              post: {
                operationId: "groupsIntegrationControllerScenario6",
                parameters: [],
                requestBody: {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/MyModel"
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
                          $ref: "#/components/schemas/MyModel"
                        }
                      }
                    },
                    description: "Created"
                  }
                },
                tags: ["GroupsIntegrationController"]
              }
            }
          },
          tags: [
            {
              name: "GroupsIntegrationController"
            }
          ]
        });
      });
    });

    describe("scenario: 1", () => {
      it("should returns only props that not decorated by Groups or Groups with negative rule)", async () => {
        const response = await request.get(`/rest/groups/scenario-1`).expect(200);

        expect(response.body).toEqual({
          id: "id",
          prop3: "prop3"
        });
      });
    });
    describe("scenario: 2", () => {
      it("should returns only props that match the groups rules", async () => {
        const response = await request.get(`/rest/groups/scenario-2`).expect(200);

        expect(response.body).toEqual({
          id: "id",
          prop3: "prop3"
        });
      });
    });
    describe("scenario: 3", () => {
      it("should returns only props that match the groups (negative condition)", async () => {
        const response = await request.get(`/rest/groups/scenario-3`).expect(200);

        expect(response.body).toEqual({
          prop3: "prop3"
        });
      });
    });

    describe("scenario: 4", () => {
      it("should post data with all field", async () => {
        const response = await request
          .post(`/rest/groups/scenario-4`)
          .send({
            id: "id",
            prop1: "prop1",
            prop2: "prop2",
            prop3: "prop3"
          })
          .expect(200);

        expect(response.body).toEqual({
          id: "id",
          prop3: "prop3"
        });
      });
    });

    describe("scenario: 5", () => {
      it("should post data with defined groups rules", async () => {
        const response = await request
          .post(`/rest/groups/scenario-5`)
          .send({
            id: "id",
            prop1: "prop1",
            prop2: "prop2",
            prop3: "prop3"
          })
          .expect(200);

        expect(response.body).toEqual({
          id: "id",
          prop1: "prop1",
          prop3: "prop3"
        });
      });
    });

    describe("scenario: 6", () => {
      it("should post data with default groups rules", async () => {
        const response = await request
          .post(`/rest/groups/scenario-6`)
          .send({
            id: "id",
            prop1: "prop1",
            prop2: "prop2",
            prop3: "prop3"
          })
          .expect(201);

        expect(response.body).toEqual({
          id: "id",
          prop3: "prop3"
        });
      });
    });
  });
});
