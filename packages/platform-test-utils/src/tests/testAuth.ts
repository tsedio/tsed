import {Context, Controller, Get, Inject, Injectable, Middleware, PlatformTest, Post, UseAuth} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import {BadRequest, Forbidden, Unauthorized} from "@tsed/exceptions";
import {In, Returns, Security} from "@tsed/schema";
import {expect} from "chai";
import * as SuperTest from "supertest";
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
  token() {
    return {
      id: "id",
      name: "name"
    };
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
        consumes: ["application/json"],
        info: {
          description: "",
          termsOfService: "",
          title: "Api documentation",
          version: "1.0.0"
        },
        paths: {
          "/rest/auth/admin": {
            get: {
              operationId: "testAuthCtrlAdmin",
              parameters: [
                {
                  in: "header",
                  name: "Authorization",
                  required: true,
                  type: "string"
                }
              ],
              responses: {
                "401": {
                  description: "Unauthorized",
                  schema: {
                    type: "string"
                  }
                },
                "403": {
                  description: "Forbidden",
                  schema: {
                    type: "string"
                  }
                }
              },
              security: {
                global_auth: ["admin"]
              },
              tags: ["TestAuthCtrl"]
            }
          },
          "/rest/auth/authorize": {
            post: {
              operationId: "testAuthCtrlAuthorize",
              parameters: [],
              responses: {
                "200": {
                  description: "Success"
                }
              },
              tags: ["TestAuthCtrl"]
            }
          },
          "/rest/auth/stepUp": {
            post: {
              operationId: "testAuthCtrlStepUp",
              parameters: [],
              responses: {
                "200": {
                  description: "Success"
                }
              },
              tags: ["TestAuthCtrl"]
            }
          },
          "/rest/auth/userinfo": {
            get: {
              operationId: "testAuthCtrlToken",
              parameters: [
                {
                  in: "header",
                  name: "Authorization",
                  required: true,
                  type: "string"
                }
              ],
              responses: {
                "401": {
                  description: "Unauthorized",
                  schema: {
                    type: "string"
                  }
                },
                "403": {
                  description: "Forbidden",
                  schema: {
                    type: "string"
                  }
                }
              },
              security: {
                global_auth: []
              },
              tags: ["TestAuthCtrl"]
            }
          }
        },
        produces: ["application/json"],
        swagger: "2.0",
        tags: [
          {
            name: "TestAuthCtrl"
          }
        ]
      });
    });
  });
}
