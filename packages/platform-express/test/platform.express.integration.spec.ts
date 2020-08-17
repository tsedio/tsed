import {
  AcceptMime,
  BodyParams,
  Controller,
  Get,
  Header,
  HeaderParams,
  Inject,
  Location,
  PlatformApplication,
  PlatformTest,
  Post,
  Redirect,
  Res,
  Status
} from "@tsed/common";
import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import {getSpec} from "@tsed/schema";
import * as bodyParser from "body-parser";
import {expect} from "chai";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as expressSession from "express-session";
import {readFileSync} from "fs";
import * as methodOverride from "method-override";
import * as SuperTest from "supertest";
import {ResourcesCtrl} from "./controllers/ResourcesCtrl";

const rootDir = __dirname;

@Controller("/children")
class TestChildController {
  @Get("/")
  get() {
    return "hello child";
  }
}

@Controller({
  path: "/",
  children: [
    TestChildController
  ]
})
class TestController {
  @Get("/scenario-1")
  scenario1() {
    return "hello world";
  }

  @Get("/scenario-2")
  scenario2(@Res() res: Res) {
    return res.send("hello world");
  }

  @Post("/scenario-3")
  @Status(201, {description: "description-from-status"})
  @Header("x-platform", "express")
  @AcceptMime("application/json")
  scenario3(@HeaderParams("Content-type") contentType: string,
            @BodyParams() payload: any) {
    return {payload, contentType};
  }

  @Get("/scenario-4")
  @Location("/child/get")
  scenario4(@Res() res: Res) {
    return "";
  }

  @Get("/scenario-5")
  @Redirect(302, "/child/get")
  scenario5(@Res() res: Res) {
    return "";
  }
}

@Configuration({
  logger: {
    level: "off"
  },
  mount: {
    "/": [
      TestController,
      ResourcesCtrl
    ]
  },
  statics: {
    "/": `${rootDir}/public`
  }
})
class Server {
  @Inject()
  app: PlatformApplication;

  $beforeRoutesInit() {
    this.app
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(
        expressSession({
          secret: "keyboard cat",
          resave: false,
          saveUninitialized: true,
          cookie: {}
        })
      );
  }
}

describe("PlatformExpress", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterEach(PlatformTest.reset);

  describe("spec", () => {
    it("should generate a JSON", () => {
      expect(getSpec(TestController)).to.deep.equal({
        "definitions": {},
        "paths": {
          "/scenario-1": {
            "get": {
              "operationId": "testControllerScenario1",
              "parameters": [],
              "responses": {
                "200": {
                  "description": "Success"
                }
              },
              "tags": [
                "TestController"
              ]
            }
          },
          "/scenario-2": {
            "get": {
              "operationId": "testControllerScenario2",
              "parameters": [],
              "responses": {
                "200": {
                  "description": "Success"
                }
              },
              "tags": [
                "TestController"
              ]
            }
          },
          "/scenario-3": {
            "post": {
              "operationId": "testControllerScenario3",
              "parameters": [
                {
                  "in": "header",
                  "required": false,
                  "name": "Content-type",
                  "type": "string"
                },
                {
                  "in": "body",
                  "name": "body",
                  "required": false,
                  "type": "object"
                }
              ],
              "consumes": [
                "application/json"
              ],
              "produces": [
                "text/json"
              ],
              "responses": {
                "201": {
                  "description": "description-from-status",
                  "headers": {
                    "x-platform": {
                      "example": "express",
                      "type": "string"
                    }
                  },
                  "schema": {
                    "type": "object"
                  }
                }
              },
              "tags": [
                "TestController"
              ]
            }
          },
          "/scenario-4": {
            "get": {
              "operationId": "testControllerScenario4",
              "parameters": [],
              "responses": {
                "200": {
                  "description": "Success"
                }
              },
              "tags": [
                "TestController"
              ]
            }
          },
          "/scenario-5": {
            "get": {
              "operationId": "testControllerScenario5",
              "parameters": [],
              "responses": {
                "200": {
                  "description": "Success"
                }
              },
              "tags": [
                "TestController"
              ]
            }
          }
        },
        "tags": [
          {
            "name": "TestController"
          }
        ]
      });
    });
  });

  describe("statics()", () => {
    it("should return index HTML", async () => {
      const response = await request.get("/").expect(200);

      expect(response.text).to.equal(readFileSync(`${rootDir}/public/index.html`, {encoding: "utf8"}));
    });
  });

  describe("scenario 1: Get response", () => {
    it("should return a response from method", async () => {
      const response = await request.get("/scenario-1").expect(200);

      expect(response.text).to.equal("hello world");
    });
  });

  describe("scenario 2: Get response (raw response)", () => {
    it("should return a response from method", async () => {
      const response = await request.get("/scenario-2").expect(200);

      expect(response.text).to.equal("hello world");
    });
  });

  describe("scenario 3: Post a payload", () => {
    it("should return a response from method", async () => {
      const response = await request.post("/scenario-3")
        .set({
          "Content-Type": "application/json"
        })
        .send({
          id: "id"
        })
        .expect(201);

      expect(response.header["x-platform"]).to.eq("express");
      expect(response.body).to.deep.equal({
        "contentType": "application/json",
        "payload": {
          "id": "id"
        }
      });
    });
  });

  describe("scenario 4: Location", () => {
    it("should set the location", async () => {
      const response = await request.get("/scenario-4").expect(200);

      expect(response.text).to.equal("");
      expect(response.header.location).to.deep.equal("/child/get");
    });
  });

  describe("scenario 5: Redirect", () => {
    it("should set the redirect", async () => {
      const response = await request.get("/scenario-5").expect(302);

      expect(response.text).to.equal("Found. Redirecting to /child/get");
      expect(response.header.location).to.deep.equal("/child/get");
    });
  });

  describe("scenario: Children controller", () => {
    it("should set the redirect", async () => {
      const response = await request.get("/children").expect(200);

      expect(response.text).to.equal("hello child");
    });
  });

  describe("scenario: Resources", () => {
    describe("GET /resources/{:id}", () => {
      it("should get resource", async () => {
        // GIVEN
        const response = await request.get("/resources/1").expect(200);

        expect(response.body).to.deep.eq({
          "id": "1",
          "name": "Test"
        });
      });
    });

    describe("POST /resources/", () => {
      it("should post resource", async () => {
        // GIVEN
        const response = await request.post("/resources").send({
          name: "NewTest"
        }).expect(201);

        expect(response.body.id).to.be.a("string");
        expect(response.body.name).to.be.eq("NewTest");
      });
    });

    describe("PUT /resources/", () => {
      it("should PUT resource", async () => {
        // GIVEN
        const response = await request.put("/resources/1").send({
          id: "1",
          name: "NewTest"
        }).expect(200);

        expect(response.body.id).to.be.a("string");
        expect(response.body.name).to.be.eq("NewTest");
      });
    });

    describe("DELETE /resources/:id", () => {
      it("should PUT resource", async () => {
        await request.delete("/resources/1").expect(204);
      });
    });
  });
});
