import {Controller, Get, PlatformTest} from "@tsed/common";
import {PlatformTestUtils} from "@tsed/platform-test-utils";
import {getSpec, Returns, SpecTypes} from "@tsed/schema";
import {expect} from "chai";
import SuperTest from "supertest";
import {PlatformExpress} from "../src";
import {rootDir, Server} from "./app/Server";

const utils = PlatformTestUtils.create({
  rootDir,
  platform: PlatformExpress,
  server: Server,
  logger: {
    level: "off"
  }
});

@Controller("/plain-text")
class TestResponseParamsCtrl {
  @Get("/scenario14")
  @(Returns(200, String).ContentType("text/plain"))
  test() {
    return {
      id: "id"
    };
  }
}

describe("PlainText", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(utils.bootstrap({
    mount: {
      "/rest": [TestResponseParamsCtrl]
    }
  }));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(utils.reset);
  describe("plain/text", () => {
    it("should text", async () => {
      const spec = getSpec(TestResponseParamsCtrl, {specType: SpecTypes.OPENAPI});
      const response = await request.get("/rest/plain-text/scenario14");

      expect(spec).to.deep.eq({
        "paths": {
          "/plain-text/scenario14": {
            "get": {
              "operationId": "testResponseParamsCtrlTest",
              "parameters": [],
              "responses": {
                "200": {
                  "content": {
                    "text/plain": {
                      "schema": {
                        "type": "string"
                      }
                    }
                  },
                  "description": "Success"
                }
              },
              "tags": [
                "TestResponseParamsCtrl"
              ]
            }
          }
        },
        "tags": [
          {
            "name": "TestResponseParamsCtrl"
          }
        ]
      });
      expect(response.headers["content-type"]).to.equal("text/plain; charset=utf-8");
      expect(response.text).to.equal("{\"id\":\"id\"}");
    });
  });
});
