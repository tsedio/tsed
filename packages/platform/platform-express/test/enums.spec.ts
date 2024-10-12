import "@tsed/ajv";

import {Env} from "@tsed/core";
import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {QueryParams} from "@tsed/platform-params";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {Default, Enum, enums, Get, getSpec, SpecTypes} from "@tsed/schema";
import SuperTest from "supertest";

import {PlatformExpress} from "../src/index.js";
import {rootDir, Server} from "./app/Server.js";

enums(Env).label("Env");

const utils = PlatformTestSdk.create({
  rootDir,
  platform: PlatformExpress,
  server: Server
});

@Controller("/enums")
class TestEnumsCtrl {
  @Get("/")
  get(@QueryParams("env") @Enum(Env) @Default(Env.TEST) env: Env = Env.TEST) {
    return {env};
  }
}

describe("Enums", () => {
  let request: SuperTest.Agent;

  beforeAll(
    utils.bootstrap({
      mount: {
        "/rest": [TestEnumsCtrl]
      },
      swagger: [
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
    const spec = getSpec(TestEnumsCtrl, {specType: SpecTypes.OPENAPI});

    expect(spec).toEqual({
      components: {
        schemas: {
          Env: {
            enum: ["production", "development", "test"],
            type: "string"
          }
        }
      },
      paths: {
        "/enums": {
          get: {
            operationId: "testEnumsCtrlGet",
            parameters: [
              {
                in: "query",
                name: "env",
                required: false,
                schema: {
                  $ref: "#/components/schemas/Env"
                },
                style: "deepObject"
              }
            ],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["TestEnumsCtrl"]
          }
        }
      },
      tags: [
        {
          name: "TestEnumsCtrl"
        }
      ]
    });
  });

  describe("GET /rest/enums", () => {
    it("should return given enum", async () => {
      const {body} = await request.get("/rest/enums?env=test");

      expect(body).toEqual({
        env: "test"
      });
    });
  });
});
