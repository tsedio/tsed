import {Context, Controller, Get, Inject, Injectable, Middleware, PlatformTest, Post, Req, UseAuth} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import {BadRequest, Forbidden, Unauthorized} from "@tsed/exceptions";
import {In, Returns, Security} from "@tsed/schema";
import {expect} from "chai";
import SuperTest from "supertest";
import baseSpec from "../data/swagger.json";
import {PlatformTestOptions} from "../interfaces";

@Injectable()
export class TokenService {
  private _token: string = "EMPTY";

  token(token?: string) {
    if (token) {
      this._token = token;
    }

    return this._token;
  }

  isValid(token: string | undefined) {
    return String(token).match(/token/);
  }
}

@Middleware()
class OAuthMiddleware {
  @Inject()
  tokenService: TokenService;

  public use(@Context() ctx: Context) {
    const {endpoint, request} = ctx;

    const options = endpoint.get(OAuthMiddleware) || {};

    if (!request.get("authorization")) {
      throw new Unauthorized("Unauthorized");
    }

    if (!this.tokenService.isValid(request.get("authorization"))) {
      throw new BadRequest("Bad token format");
    }

    if (options && options.role === "admin" && request.get("authorization") !== "admin_token") {
      throw new Forbidden("Forbidden");
    }

    ctx.getRequest().user = {
      id: "id",
      name: "name"
    };
  }
}

export function OAuth(options: any = {}): Function {
  return useDecorators(
    UseAuth(OAuthMiddleware, options),
    Security("global_auth", ...(options.scopes || [])),
    In("header").Type(String).Name("Authorization").Required(),
    Returns(401).Description("Unauthorized"),
    Returns(403).Description("Forbidden")
  );
}

@Controller("/auth")
class TestAuthCtrl {
  @Inject()
  tokenService: TokenService;

  @Post("/authorize")
  authorize() {
    this.tokenService.token("access_token");

    return {
      access_token: this.tokenService.token()
    };
  }

  @Get("/userinfo")
  @OAuth()
  token(@Req("user") user: any) {
    return user;
  }

  @Get("/admin")
  @OAuth({role: "admin", scopes: ["admin"]})
  admin() {
    return {
      granted: true
    };
  }

  @Post("/stepUp")
  stepUp() {
    this.tokenService.token("admin_token");

    return {
      access_token: this.tokenService.token()
    };
  }
}

export function testAuth(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestAuthCtrl]
      },
      swagger: [
        {
          path: "/doc",
          spec: baseSpec as any
        }
      ]
    })
  );
  before(() => {
    request = SuperTest.agent(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  describe("Scenario 1: Create token, test token and stepup token", () => {
    it("should create a token, call /userinfo to get userinfo and try admin route", async () => {
      await request.get("/rest/auth/userinfo").expect(401);
      await request
        .get("/rest/auth/userinfo")
        .set({
          Authorization: "wrong"
        })
        .expect(400);

      const {body} = await request.post("/rest/auth/authorize").expect(200);

      expect(body.access_token).to.equal("access_token");

      const {body: userInfo} = await request
        .get("/rest/auth/userinfo")
        .set({
          Authorization: body.access_token
        })
        .expect(200);

      expect(userInfo).to.deep.eq({
        id: "id",
        name: "name"
      });

      await request
        .get("/rest/auth/admin")
        .set({
          Authorization: body.access_token
        })
        .expect(403);

      const {
        body: {access_token}
      } = await request.post("/rest/auth/stepUp").expect(200);

      expect(access_token).to.equal("admin_token");

      const {body: result} = await request
        .get("/rest/auth/admin")
        .set({
          Authorization: access_token
        })
        .expect(200);

      expect(result).to.deep.eq({
        granted: true
      });
    });
  });

  describe("Scenario 2: GET /swagger.json", () => {
    it("should generate the swagger.spec", async () => {
      const {body: spec} = await request.get("/doc/swagger.json").expect(200);
      expect(spec).to.deep.equal({
        swagger: "2.0",
        consumes: ["application/json"],
        produces: ["application/json"],
        info: {
          contact: {
            email: "apiteam@swagger.io"
          },
          description: "Swagger description",
          license: {
            name: "Apache 2.0",
            url: "http://www.apache.org/licenses/LICENSE-2.0.html"
          },
          termsOfService: "http://swagger.io/terms/",
          title: "Swagger Title",
          version: "1.0.0"
        },
        securityDefinitions: {
          global_auth: {
            authorizationUrl: "http://petstore.swagger.io/oauth/dialog",
            flow: "implicit",
            scopes: {
              admin: "Admin access"
            },
            type: "oauth2"
          }
        },
        paths: {
          "/rest/auth/authorize": {
            post: {
              operationId: "testAuthCtrlAuthorize",
              parameters: [],
              responses: {"200": {description: "Success"}},
              tags: ["TestAuthCtrl"]
            }
          },
          "/rest/auth/userinfo": {
            get: {
              operationId: "testAuthCtrlToken",
              parameters: [{name: "Authorization", required: true, in: "header", type: "string"}],
              responses: {
                "401": {description: "Unauthorized", schema: {$ref: "#/definitions/Unauthorized"}},
                "403": {description: "Forbidden", schema: {$ref: "#/definitions/Forbidden"}}
              },
              security: [{global_auth: []}],
              produces: ["application/json"],
              tags: ["TestAuthCtrl"]
            }
          },
          "/rest/auth/admin": {
            get: {
              operationId: "testAuthCtrlAdmin",
              parameters: [{name: "Authorization", required: true, in: "header", type: "string"}],
              responses: {
                "401": {description: "Unauthorized", schema: {$ref: "#/definitions/Unauthorized"}},
                "403": {description: "Forbidden", schema: {$ref: "#/definitions/Forbidden"}}
              },
              security: [{global_auth: ["admin"]}],
              produces: ["application/json"],
              tags: ["TestAuthCtrl"]
            }
          },
          "/rest/auth/stepUp": {
            post: {operationId: "testAuthCtrlStepUp", parameters: [], responses: {"200": {description: "Success"}}, tags: ["TestAuthCtrl"]}
          }
        },
        tags: [{name: "TestAuthCtrl"}],
        definitions: {
          GenericError: {
            additionalProperties: true,
            properties: {
              message: {
                description: "An error message",
                minLength: 1,
                type: "string"
              },
              name: {
                description: "The error name",
                minLength: 1,
                type: "string"
              }
            },
            required: ["name", "message"],
            type: "object"
          },
          Unauthorized: {
            type: "object",
            properties: {
              name: {type: "string", minLength: 1, description: "The error name", example: "UNAUTHORIZED", default: "UNAUTHORIZED"},
              message: {type: "string", minLength: 1, description: "An error message"},
              status: {type: "number", description: "The status code of the exception", example: 401, default: 401},
              errors: {
                type: "array",
                items: {
                  $ref: "#/definitions/GenericError"
                },
                description: "A list of related errors"
              },
              stack: {type: "array", items: {type: "string"}, description: "The stack trace (only in development mode)"}
            },
            required: ["name", "message", "status"]
          },
          Forbidden: {
            type: "object",
            properties: {
              name: {type: "string", minLength: 1, description: "The error name", example: "FORBIDDEN", default: "FORBIDDEN"},
              message: {type: "string", minLength: 1, description: "An error message"},
              status: {type: "number", description: "The status code of the exception", example: 403, default: 403},
              errors: {
                type: "array",
                items: {
                  $ref: "#/definitions/GenericError"
                },
                description: "A list of related errors"
              },
              stack: {type: "array", items: {type: "string"}, description: "The stack trace (only in development mode)"}
            },
            required: ["name", "message", "status"]
          }
        }
      });
    });
  });
}
