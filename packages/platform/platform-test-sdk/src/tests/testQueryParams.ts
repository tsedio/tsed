import "@tsed/ajv";

import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {QueryParams} from "@tsed/platform-params";
import {Get, Maximum, Minimum, Required} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, beforeAll, describe, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

export class RandomStringModel {
  @Maximum(250)
  @Minimum(1)
  @Required()
  length: number;
}

@Controller("/query-params")
class TestQueryParamsCtrl {
  @Get("/scenario-1")
  testScenario1(@QueryParams("test") value: boolean): any {
    return {value};
  }

  @Get("/scenario-2")
  testScenario2(@QueryParams("test") value: boolean = true): any {
    return {value};
  }

  @Get("/scenario-3")
  testScenario3(@QueryParams("test") value: number): any {
    return {value};
  }

  @Get("/scenario-4")
  testScenario4(@QueryParams("test") value: string): any {
    return {value};
  }

  @Get("/scenario-5")
  testScenario5(@QueryParams() value: RandomStringModel): any {
    return {value};
  }

  @Get("/scenario-6")
  testScenario8(@QueryParams("test", String) value: string[]): any {
    return {value};
  }
}

export function testQueryParams(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      ajv: {
        verbose: false
      },
      mount: {
        "/rest": [TestQueryParamsCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);
  describe("Scenario1: Boolean value", () => {
    it("should return true when query is true", async () => {
      const response = await request.get("/rest/query-params/scenario-1?test=true").expect(200);

      expect(response.body).toEqual({value: true});
    });
    it("should return true when query is 1", async () => {
      const response = await request.get("/rest/query-params/scenario-1?test=1").expect(200);

      expect(response.body).toEqual({value: true});
    });
    it("should return false when query is false", async () => {
      const response = await request.get("/rest/query-params/scenario-1?test=false").expect(200);

      expect(response.body).toEqual({value: false});
    });
    it("should return false when query is 0", async () => {
      const response = await request.get("/rest/query-params/scenario-1?test=0").expect(200);

      expect(response.body).toEqual({value: false});
    });
    it("should return false when query is null", async () => {
      const response = await request.get("/rest/query-params/scenario-1?test=null").expect(200);

      expect(response.body).toEqual({value: null});
    });
    it("should return undefined when query is empty", async () => {
      const response = await request.get("/rest/query-params/scenario-1?test=").expect(200);

      expect(response.body).toEqual({});
    });
    it("should return undefined when no query", async () => {
      const response = await request.get("/rest/query-params/scenario-1").expect(200);

      expect(response.body).toEqual({});
    });
  });
  describe("Scenario2: Boolean value with default value", () => {
    it("should return true when query is true", async () => {
      const response = await request.get("/rest/query-params/scenario-2?test=true").expect(200);

      expect(response.body).toEqual({value: true});
    });
    it("should return true when query is 1", async () => {
      const response = await request.get("/rest/query-params/scenario-2?test=1").expect(200);

      expect(response.body).toEqual({value: true});
    });
    it("should return false when query is false", async () => {
      const response = await request.get("/rest/query-params/scenario-2?test=false").expect(200);

      expect(response.body).toEqual({value: false});
    });
    it("should return false when query is 0", async () => {
      const response = await request.get("/rest/query-params/scenario-2?test=0").expect(200);

      expect(response.body).toEqual({value: false});
    });
    it("should return false when query is null", async () => {
      const response = await request.get("/rest/query-params/scenario-2?test=null").expect(200);

      expect(response.body).toEqual({value: null});
    });
    it("should return undefined when query is empty", async () => {
      const response = await request.get("/rest/query-params/scenario-2?test=").expect(200);

      expect(response.body).toEqual({value: true});
    });
    it("should return undefined when no query", async () => {
      const response = await request.get("/rest/query-params/scenario-2").expect(200);

      expect(response.body).toEqual({value: true});
    });
  });
  describe("Scenario3: Number value", () => {
    const endpoint = "/rest/query-params/scenario-3";
    it("should return 0 when query is 0", async () => {
      const response = await request.get(`${endpoint}?test=0`).expect(200);

      expect(response.body).toEqual({value: 0});
    });
    it("should return 1 when query is 1", async () => {
      const response = await request.get(`${endpoint}?test=1`).expect(200);

      expect(response.body).toEqual({value: 1});
    });
    it("should return 0.1 when query is 0.1", async () => {
      const response = await request.get(`${endpoint}?test=0.1`).expect(200);

      expect(response.body).toEqual({value: 0.1});
    });
    it("should throw bad request", async () => {
      const response = await request.get(`${endpoint}?test=error`).expect(400);
      expect(response.body).toEqual({
        name: "AJV_VALIDATION_ERROR",
        message: 'Bad request on parameter "request.query.test".\nValue must be number. Given value: "error"',
        status: 400,
        errors: [
          {
            keyword: "type",
            requestPath: "query",
            dataPath: ".test",
            instancePath: "",
            schemaPath: "#/type",
            params: {type: "number"},
            message: "must be number",
            data: "error"
          }
        ]
      });
    });
    it("should return undefined when query is empty", async () => {
      const response = await request.get(`${endpoint}?test=null`).expect(200);

      expect(response.body).toEqual({value: null});
    });
    it("should return undefined when query is empty", async () => {
      const response = await request.get(`${endpoint}?test=`).expect(200);

      expect(response.body).toEqual({});
    });
    it("should return undefined when no query", async () => {
      const response = await request.get(`${endpoint}`).expect(200);

      expect(response.body).toEqual({});
    });
  });
  describe("Scenario4: String value", () => {
    const endpoint = "/rest/query-params/scenario-4";
    it("should return 0 when query is 0", async () => {
      const response = await request.get(`${endpoint}?test=0`).expect(200);

      expect(response.body).toEqual({value: "0"});
    });
    it("should return 1 when query is 1", async () => {
      const response = await request.get(`${endpoint}?test=1`).expect(200);

      expect(response.body).toEqual({value: "1"});
    });
    it("should return 0.1 when query is 0.1", async () => {
      const response = await request.get(`${endpoint}?test=0.1`).expect(200);

      expect(response.body).toEqual({value: "0.1"});
    });
    it("should return undefined when query is empty", async () => {
      const response = await request.get(`${endpoint}?test=`).expect(200);

      expect(response.body).toEqual({value: ""});
    });
    it("should return undefined when no query", async () => {
      const response = await request.get(`${endpoint}`).expect(200);

      expect(response.body).toEqual({});
    });
  });
  describe("Scenario6: String[] value", () => {
    const endpoint = "/rest/query-params/scenario-6";
    it("should return 0 when query is 0", async () => {
      const response = await request.get(`${endpoint}?test=0`).expect(200);

      expect(response.body).toEqual({value: ["0"]});
    });
    it("should return 1 when query is 1", async () => {
      const response = await request.get(`${endpoint}?test=1&test=2`).expect(200);

      expect(response.body).toEqual({value: ["1", "2"]});
    });
  });
}
