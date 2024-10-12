import "@tsed/ajv";

import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {BodyParams} from "@tsed/platform-params";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {Any, CollectionOf, Post, Property} from "@tsed/schema";
import SuperTest from "supertest";

import {PlatformExpress} from "../src/index.js";
import {rootDir, Server} from "./app/Server.js";

const utils = PlatformTestSdk.create({
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
  scenario1(@BodyParams() list: any[]) {
    return list;
  }

  @Post("/2")
  scenario2(@BodyParams() list: number[]) {
    return list;
  }

  @Post("/3")
  scenario3(@BodyParams() @CollectionOf(Number) list: number[]) {
    return list;
  }

  @Post("/4")
  scenario4(@BodyParams() @CollectionOf(MyModel) list: MyModel[]) {
    return list;
  }

  @Post("/5")
  scenario5(@BodyParams() list: any) {
    return list;
  }

  @Post("/6")
  scenario6(@BodyParams() @Any() list: any) {
    return list;
  }
}

describe("Array Body", () => {
  let request: SuperTest.Agent;

  beforeAll(
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
  afterAll(() => utils.reset());

  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });

  describe("swagger", () => {
    it("should return the swagger (OS3)", async () => {
      const {body} = await request.get("/v3/docs/swagger.json").expect(200);

      expect(body).toMatchSnapshot();
    });
  });

  describe("POST /rest/array/1", () => {
    it("should return list", async () => {
      const {body} = await request
        .post("/rest/array/1")
        .send([{test: "test"}])
        .expect(200);

      expect(body).toEqual([
        {
          test: "test"
        }
      ]);
    });
  });
  describe("POST /rest/array/2", () => {
    it("should return list", async () => {
      const {body} = await request
        .post("/rest/array/2")
        .send([{test: 1}])
        .expect(200);

      expect(body).toEqual([
        {
          test: 1
        }
      ]);
    });
  });

  describe("POST /rest/array/3", () => {
    it("should return list", async () => {
      const {body} = await request.post("/rest/array/3").send([1]).expect(200);

      expect(body).toEqual([1]);
    });
  });

  describe("POST /rest/array/4", () => {
    it("should return list", async () => {
      const {body} = await request
        .post("/rest/array/4")
        .send([{test: "1"}])
        .expect(200);

      expect(body).toEqual([
        {
          test: "1"
        }
      ]);
    });
  });
  describe("POST /rest/array/5", () => {
    it("should throw a bad request", async () => {
      const {body} = await request
        .post("/rest/array/5")
        .send([{test: "1"}])
        .expect(400);

      expect(body).toEqual({
        errors: [
          {
            requestPath: "body",
            data: [
              {
                test: "1"
              }
            ],
            dataPath: "",
            keyword: "type",
            instancePath: "",
            message: "must be object",
            params: {
              type: "object"
            },
            schemaPath: "#/type"
          }
        ],
        message: 'Bad request on parameter "request.body".\nValue must be object. Given value: [{"test":"1"}]',
        name: "AJV_VALIDATION_ERROR",
        status: 400
      });
    });
  });
});
