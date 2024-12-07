import {useDecorators} from "@tsed/core";
import {Controller, Inject, Injectable} from "@tsed/di";
import {BadRequest, Forbidden, Unauthorized} from "@tsed/exceptions";
import {Req, Res} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Middleware, UseAuth} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";
import {Get, In, Post, Returns, Security} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, beforeAll, describe, expect, it} from "vitest";

import baseSpec from "../data/swagger.json";
import {PlatformTestingSdkOpts} from "../interfaces/index.js";

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

export function testAuth(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
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
  beforeAll(() => {
    request = SuperTest.agent(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

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

      expect(body.access_token).toEqual("access_token");

      const {body: userInfo} = await request
        .get("/rest/auth/userinfo")
        .set({
          Authorization: body.access_token
        })
        .expect(200);

      expect(userInfo).toEqual({
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

      expect(access_token).toEqual("admin_token");

      const {body: result} = await request
        .get("/rest/auth/admin")
        .set({
          Authorization: access_token
        })
        .expect(200);

      expect(result).toEqual({
        granted: true
      });
    });
  });

  describe("Scenario 2: GET /swagger.json", () => {
    it("should generate the swagger.spec", async () => {
      const {body: spec} = await request.get("/doc/swagger.json").expect(200);

      expect(spec).toEqual({
        openapi: "3.0.1",
        info: {
          version: "1.0.0",
          title: "Swagger Title",
          description: "Swagger description",
          termsOfService: "http://swagger.io/terms/",
          contact: {email: "apiteam@swagger.io"},
          license: {name: "Apache 2.0", url: "http://www.apache.org/licenses/LICENSE-2.0.html"}
        },
        paths: {
          "/rest/auth/authorize": {
            post: {
              operationId: "testAuthCtrlAuthorize",
              responses: {"200": {description: "Success"}},
              parameters: [],
              tags: ["TestAuthCtrl"]
            }
          },
          "/rest/auth/userinfo": {
            get: {
              operationId: "testAuthCtrlToken",
              responses: {
                "401": {
                  content: {"application/json": {schema: {$ref: "#/components/schemas/Unauthorized"}}},
                  description: "Unauthorized"
                },
                "403": {
                  content: {"application/json": {schema: {$ref: "#/components/schemas/Forbidden"}}},
                  description: "Forbidden"
                }
              },
              security: [{global_auth: []}],
              parameters: [
                {
                  name: "Authorization",
                  required: true,
                  in: "header",
                  schema: {type: "string"}
                }
              ],
              tags: ["TestAuthCtrl"]
            }
          },
          "/rest/auth/admin": {
            get: {
              operationId: "testAuthCtrlAdmin",
              responses: {
                "401": {
                  content: {"application/json": {schema: {$ref: "#/components/schemas/Unauthorized"}}},
                  description: "Unauthorized"
                },
                "403": {
                  content: {"application/json": {schema: {$ref: "#/components/schemas/Forbidden"}}},
                  description: "Forbidden"
                }
              },
              security: [{global_auth: ["admin"]}],
              parameters: [
                {
                  name: "Authorization",
                  required: true,
                  in: "header",
                  schema: {type: "string"}
                }
              ],
              tags: ["TestAuthCtrl"]
            }
          },
          "/rest/auth/stepUp": {
            post: {
              operationId: "testAuthCtrlStepUp",
              responses: {"200": {description: "Success"}},
              parameters: [],
              tags: ["TestAuthCtrl"]
            }
          }
        },
        components: {
          securitySchemes: {
            global_auth: {
              type: "oauth2",
              flows: {
                implicit: {
                  authorizationUrl: "http://petstore.swagger.io/oauth/dialog",
                  scopes: {admin: "Admin access"}
                }
              }
            }
          },
          schemas: {
            Unauthorized: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The error name",
                  minLength: 1,
                  example: "UNAUTHORIZED",
                  default: "UNAUTHORIZED"
                },
                message: {type: "string", description: "An error message", minLength: 1},
                status: {
                  type: "number",
                  description: "The status code of the exception",
                  example: 401,
                  default: 401
                },
                errors: {
                  type: "array",
                  items: {$ref: "#/components/schemas/GenericError"},
                  description: "A list of related errors"
                },
                stack: {type: "string", description: "The stack trace (only in development mode)"}
              },
              required: ["name", "message", "status"]
            },
            GenericError: {
              type: "object",
              properties: {
                name: {type: "string", description: "The error name", minLength: 1},
                message: {type: "string", description: "An error message", minLength: 1}
              },
              additionalProperties: true,
              required: ["name", "message"]
            },
            Forbidden: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The error name",
                  minLength: 1,
                  example: "FORBIDDEN",
                  default: "FORBIDDEN"
                },
                message: {type: "string", description: "An error message", minLength: 1},
                status: {
                  type: "number",
                  description: "The status code of the exception",
                  example: 403,
                  default: 403
                },
                errors: {
                  type: "array",
                  items: {$ref: "#/components/schemas/GenericError"},
                  description: "A list of related errors"
                },
                stack: {type: "string", description: "The stack trace (only in development mode)"}
              },
              required: ["name", "message", "status"]
            }
          }
        },
        tags: [{name: "TestAuthCtrl"}]
      });
    });
  });
}
