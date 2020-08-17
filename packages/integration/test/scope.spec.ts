import {
  $log,
  BodyParams,
  Controller,
  EndpointMetadata,
  Get,
  PathParams,
  PlatformTest,
  Post,
  Scope,
  Status,
  Returns
} from "@tsed/common";
import {nameOf} from "@tsed/core";
import {getSpec} from "@tsed/schema/src";
import {Docs, Hidden} from "@tsed/swagger";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {User, UserCreation} from "../src/models/User";
import {InnerService} from "../src/services/InnerService";
import {OuterService} from "../src/services/OuterService";
import {UserService} from "../src/services/UserService";
import {TestServer} from "./helpers/TestServer";

@Controller("/scopes")
@Scope("request")
@Hidden()
@Docs("hidden")
export class ScopeRequestCtrl {
  private userId: string;

  constructor(public innerService: InnerService, public outerService: OuterService, public userService: UserService) {
  }

  @Get("/scenario-1")
  scenario1() {
    return {isEqual: this.innerService === this.outerService.innerService};
  }

  @Post("/scenario-2")
  @Status(201)
  @Returns(User)
  async scenario2(@BodyParams() userData: UserCreation) {
    return this.userService.create(userData);
  }

  @Get("/scenario-3/:user")
  async scenario3(@PathParams("user") userId: string): Promise<any> {
    this.userService.user = userId;
    this.userId = userId;

    return new Promise((resolve, reject) => {
      if (userId === "0") {
        setTimeout(() => {
          resolve({userId, idSrv: this.userService.user, idCtrl: this.userId});
        }, 500);
      }

      if (userId === "1") {
        setTimeout(() => {
          resolve({userId, idSrv: this.userService.user, idCtrl: this.userId});
        }, 300);
      }

      if (userId === "2") {
        setTimeout(() => {
          resolve({userId, idSrv: this.userService.user, idCtrl: this.userId});
        }, 150);
      }
    });
  }

  $onDestroy() {
    $log.debug("Destroy controller");
  }
}

describe("Scope Request", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(PlatformTest.bootstrap(TestServer, {
    mount: {
      "/rest": [
        ScopeRequestCtrl
      ]
    }
  }));
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  it("should have the right swagger spec", () => {
    expect(getSpec(ScopeRequestCtrl)).to.deep.eq({
      "definitions": {
        "ObjectID": {
          "type": "object"
        },
        "User": {
          "properties": {
            "email": {
              "format": "email",
              "minLength": 1,
              "type": [
                "string",
                "null"
              ]
            },
            "id": {
              "$ref": "#/definitions/ObjectID"
            },
            "name": {
              "type": "string"
            },
            "password": {
              "minLength": 6,
              "type": [
                "string",
                "null"
              ]
            }
          },
          "required": [
            "password"
          ],
          "type": "object"
        },
        "UserCreation": {
          "properties": {
            "email": {
              "format": "email",
              "minLength": 1,
              "type": [
                "string",
                "null"
              ]
            },
            "name": {
              "type": "string"
            },
            "password": {
              "minLength": 6,
              "type": [
                "string",
                "null"
              ]
            }
          },
          "required": [
            "email",
            "password"
          ],
          "type": "object"
        }
      },
      "paths": {
        "/scopes/scenario-1": {
          "get": {
            "operationId": "scopeRequestCtrlScenario1",
            "parameters": [],
            "responses": {
              "200": {
                "description": "Success"
              }
            },
            "tags": [
              "ScopeRequestCtrl"
            ]
          }
        },
        "/scopes/scenario-2": {
          "post": {
            "operationId": "scopeRequestCtrlScenario2",
            "parameters": [
              {
                "in": "body",
                "name": "body",
                "required": false,
                "schema": {
                  "$ref": "#/definitions/UserCreation"
                }
              }
            ],
            "produces": [
              "text/json"
            ],
            "responses": {
              "201": {
                "description": "Created",
                "schema": {
                  "$ref": "#/definitions/User"
                }
              }
            },
            "tags": [
              "ScopeRequestCtrl"
            ]
          }
        },
        "/scopes/scenario-3/{user}": {
          "get": {
            "operationId": "scopeRequestCtrlScenario3",
            "parameters": [
              {
                "in": "path",
                "name": "user",
                "required": true,
                "type": "string"
              }
            ],
            "responses": {
              "200": {
                "description": "Success"
              }
            },
            "tags": [
              "ScopeRequestCtrl"
            ]
          }
        }
      },
      "tags": [
        {
          "name": "ScopeRequestCtrl"
        }
      ]
    });
  });

  describe("GET /rest/scopes/scenario-1", () => {
    it("should respond with the right userid", done => {
      request
        .get(`/rest/scopes/scenario-1`)
        .expect(200)
        .end((err: any, response: any) => {
          expect(response.body).to.deep.eq({isEqual: true});
          done();
        });
    });
  });
  describe("POST /rest/scopes/scenario-2", () => {
    it("should declare the endpoint with the UserModel", () => {
      const endpoint = EndpointMetadata.get(ScopeRequestCtrl, "scenario2");

      expect(nameOf(endpoint.type)).to.deep.equal("User");
    });

    it("should allow creation", async () => {
      const {body: user} = await request
        .post(`/rest/scopes/scenario-2`)
        .send({name: "test", email: null, password: null})
        .expect(201);

      expect(user.name).to.eq("test");
      expect(user.email).to.eq(null);
      expect(user.id).to.be.a("string");
      expect(user.password).to.eq(undefined);
    });

    it("should return an error when email is empty", async () => {
      const response = await request
        .post(`/rest/scopes/scenario-2`)
        .send({name: "test", email: ""})
        .expect(400);

      // @ts-ignore
      expect(JSON.parse(response.headers.errors)).to.deep.eq([
        {
          "data": "",
          "dataPath": ".email",
          "keyword": "minLength",
          "message": "should NOT be shorter than 1 characters",
          "modelName": "UserCreation",
          "params": {
            "limit": 1
          },
          "schemaPath": "#/properties/email/minLength"
        }
      ]);

      expect(response.text).to.eq("Bad request on parameter \"request.body\".<br />UserCreation.email should NOT be shorter than 1 characters. Given value: \"\"");
    });

    it("should return an error when password is empty", async () => {
      const [response, , response2]: any[] = await Promise.all([
        request
          .post(`/rest/scopes/scenario-2`)
          .send({name: "test", email: "test@test.fr", password: ""})
          .expect(400),
        request
          .post(`/rest/scopes/scenario-2`)
          .send({name: "test", email: "test@test.fr", password: ""})
          .expect(400),
        request
          .post(`/rest/scopes/scenario-2`)
          .send({name: "test", email: "test@test.fr", password: "te"})
          .expect(400)
      ]);

      expect(response.text).to.eq(
        "Bad request on parameter \"request.body\".<br />UserCreation.password should NOT be shorter than 6 characters. Given value: \"[REDACTED]\""
      );

      expect(response2.text).to.eq(
        "Bad request on parameter \"request.body\".<br />UserCreation.password should NOT be shorter than 6 characters. Given value: \"[REDACTED]\""
      );

      expect(JSON.parse(response.headers.errors)).to.deep.eq([
        {
          "data": "[REDACTED]",
          "dataPath": ".password",
          "keyword": "minLength",
          "message": "should NOT be shorter than 6 characters",
          "modelName": "UserCreation",
          "params": {
            "limit": 6
          },
          "schemaPath": "#/properties/password/minLength"
        }
      ]);
    });

    it("should allow creation with data", async () => {
      const {body: user} = await request
        .post(`/rest/scopes/scenario-2`)
        .send({name: "test", email: "test@test.fr", password: "test1267"})
        .expect(201);

      expect(user.id).to.be.a("string");
      expect(user.name).to.eq("test");
      expect(user.email).to.eq("test@test.fr");
      expect(user.password).to.eq(undefined);
    });
  });
  describe("GET /rest/scopes/scenario-3/:id", () => {
    const send = (id: string) =>
      new Promise((resolve, reject) => {
        request
          .get(`/rest/scopes/scenario-3/${id}`)
          .expect(200)
          .end((err: any, response: any) => {
            if (err) {
              reject(err);
            } else {
              resolve({id, ...JSON.parse(response.text)});
            }
          });
      });

    it("should respond with the right userid", () => {
      const promises = [];

      promises.push(send("0"));
      promises.push(send("1"));
      promises.push(send("2"));

      return Promise.all(promises).then(responses => {
        expect(responses).to.deep.eq([
          {
            id: "0",
            idCtrl: "0",
            idSrv: "0",
            userId: "0"
          },
          {
            id: "1",
            idCtrl: "1",
            idSrv: "1",
            userId: "1"
          },
          {
            id: "2",
            idCtrl: "2",
            idSrv: "2",
            userId: "2"
          }
        ]);
      });
    });
  });
});
