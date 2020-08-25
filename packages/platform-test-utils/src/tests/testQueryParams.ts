import {Controller, Get, PlatformTest, QueryParams} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

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
}

export function testQueryParams(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestQueryParamsCtrl]
      }
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);
  describe("Scenario1: Boolean value", () => {
    it("should return true when query is true", async () => {
      const response = await request.get("/rest/query-params/scenario-1?test=true").expect(200);

      expect(response.body).to.deep.equal({value: true});
    });
    it("should return true when query is 1", async () => {
      const response = await request.get("/rest/query-params/scenario-1?test=1").expect(200);

      expect(response.body).to.deep.equal({value: true});
    });
    it("should return false when query is false", async () => {
      const response = await request.get("/rest/query-params/scenario-1?test=false").expect(200);

      expect(response.body).to.deep.equal({value: false});
    });
    it("should return false when query is 0", async () => {
      const response = await request.get("/rest/query-params/scenario-1?test=0").expect(200);

      expect(response.body).to.deep.equal({value: false});
    });
    it("should return false when query is null", async () => {
      const response = await request.get("/rest/query-params/scenario-1?test=null").expect(200);

      expect(response.body).to.deep.equal({value: null});
    });
    it("should return undefined when query is empty", async () => {
      const response = await request.get("/rest/query-params/scenario-1?test=").expect(200);

      expect(response.body).to.deep.equal({});
    });
    it("should return undefined when no query", async () => {
      const response = await request.get("/rest/query-params/scenario-1").expect(200);

      expect(response.body).to.deep.equal({});
    });
  });
  describe("Scenario2: Boolean value with default value", () => {
    it("should return true when query is true", async () => {
      const response = await request.get("/rest/query-params/scenario-2?test=true").expect(200);

      expect(response.body).to.deep.equal({value: true});
    });
    it("should return true when query is 1", async () => {
      const response = await request.get("/rest/query-params/scenario-2?test=1").expect(200);

      expect(response.body).to.deep.equal({value: true});
    });
    it("should return false when query is false", async () => {
      const response = await request.get("/rest/query-params/scenario-2?test=false").expect(200);

      expect(response.body).to.deep.equal({value: false});
    });
    it("should return false when query is 0", async () => {
      const response = await request.get("/rest/query-params/scenario-2?test=0").expect(200);

      expect(response.body).to.deep.equal({value: false});
    });
    it("should return false when query is null", async () => {
      const response = await request.get("/rest/query-params/scenario-2?test=null").expect(200);

      expect(response.body).to.deep.equal({value: null});
    });
    it("should return undefined when query is empty", async () => {
      const response = await request.get("/rest/query-params/scenario-2?test=").expect(200);

      expect(response.body).to.deep.equal({value: true});
    });
    it("should return undefined when no query", async () => {
      const response = await request.get("/rest/query-params/scenario-2").expect(200);

      expect(response.body).to.deep.equal({value: true});
    });
  });
  describe("Scenario3: Number value", () => {
    const endpoint = "/rest/query-params/scenario-3";
    it("should return 0 when query is 0", async () => {
      const response = await request.get(`${endpoint}?test=0`).expect(200);

      expect(response.body).to.deep.equal({value: 0});
    });
    it("should return 1 when query is 1", async () => {
      const response = await request.get(`${endpoint}?test=1`).expect(200);

      expect(response.body).to.deep.equal({value: 1});
    });
    it("should return 0.1 when query is 0.1", async () => {
      const response = await request.get(`${endpoint}?test=0.1`).expect(200);

      expect(response.body).to.deep.equal({value: 0.1});
    });
    it("should throw bad request", async () => {
      const response = await request.get(`${endpoint}?test=error`).expect(400);
      expect(response.text).to.deep.equal(
        "Bad request on parameter \"request.query.test\".<br />Value should be number. Given value: \"error\""
      );
    });
    it("should return undefined when query is empty", async () => {
      const response = await request.get(`${endpoint}?test=null`).expect(200);

      expect(response.body).to.deep.equal({value: null});
    });
    it("should return undefined when query is empty", async () => {
      const response = await request.get(`${endpoint}?test=`).expect(200);

      expect(response.body).to.deep.equal({});
    });
    it("should return undefined when no query", async () => {
      const response = await request.get(`${endpoint}`).expect(200);

      expect(response.body).to.deep.equal({});
    });
  });
  describe("Scenario4: String value", () => {
    const endpoint = "/rest/query-params/scenario-4";
    it("should return 0 when query is 0", async () => {
      const response = await request.get(`${endpoint}?test=0`).expect(200);

      expect(response.body).to.deep.equal({value: "0"});
    });
    it("should return 1 when query is 1", async () => {
      const response = await request.get(`${endpoint}?test=1`).expect(200);

      expect(response.body).to.deep.equal({value: "1"});
    });
    it("should return 0.1 when query is 0.1", async () => {
      const response = await request.get(`${endpoint}?test=0.1`).expect(200);

      expect(response.body).to.deep.equal({value: "0.1"});
    });
    it("should return undefined when query is empty", async () => {
      const response = await request.get(`${endpoint}?test=`).expect(200);

      expect(response.body).to.deep.equal({value: ""});
    });
    it("should return undefined when no query", async () => {
      const response = await request.get(`${endpoint}`).expect(200);

      expect(response.body).to.deep.equal({});
    });
  });
}
