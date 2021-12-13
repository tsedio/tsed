import "@tsed/ajv";
import {Controller, Get, PlatformTest, QueryParams} from "@tsed/common";
import {Default, GenericOf, Generics, Maximum, Minimum, Property, Required} from "@tsed/schema";
import {expect} from "chai";
import SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

export class RandomStringModel {
  @Maximum(250)
  @Minimum(1)
  @Required()
  length: number;
}

class FindQuery {
  @Property()
  a?: number;

  @Property()
  b?: number;
}

@Generics("T")
class PaginationQuery<T> {
  // things about pagination
  @Minimum(0)
  @Default(0)
  offset?: number;

  @Minimum(1)
  @Maximum(1000)
  @Default(50)
  limit?: number;

  @Property("T")
  where?: T;
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
  testScenario6(@QueryParams() @GenericOf(FindQuery) q: PaginationQuery<FindQuery>, @QueryParams() qs: any) {
    return {q};
  }

  @Get("/scenario-7")
  testScenario7(@QueryParams("q") @GenericOf(FindQuery) q: PaginationQuery<FindQuery>) {
    return {q};
  }

  @Get("/scenario-8")
  testScenario8(@QueryParams("test", String) value: string[]): any {
    return {value};
  }
}

export function testQueryParams(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
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
      expect(response.body).to.deep.equal({
        name: "AJV_VALIDATION_ERROR",
        message: 'Bad request on parameter "request.query.test".\nValue must be number. Given value: "error"',
        status: 400,
        errors: [
          {
            keyword: "type",
            dataPath: "",
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
  describe("Scenario6: DeepObject", () => {
    const endpoint = "/rest/query-params/scenario-6";
    it("should return 0 when query is 0", async () => {
      const response = await request.get(`${endpoint}?offset=0&limit=10&where[a]=0&where[b]=1`).expect(200);

      expect(response.body).to.deep.equal({
        q: {
          limit: 10,
          offset: 0,
          where: {
            a: 0,
            b: 1
          }
        }
      });
    });
  });
  describe("Scenario7: DeepObject", () => {
    const endpoint = "/rest/query-params/scenario-7";
    it("should return the query value", async () => {
      const response = await request.get(`${endpoint}?q[offset]=0&q[limit]=10&q[where][a]=0&q[where][b]=1`).expect(200);

      expect(response.body).to.deep.equal({
        q: {
          limit: 10,
          offset: 0,
          where: {
            a: 0,
            b: 1
          }
        }
      });
    });
    it("should throw a bad request", async () => {
      const response = await request.get(`${endpoint}?q[offset]=0&q[limit]=10&q[where][a]=ca&q[where][b]=1`).expect(400);

      expect(response.body).to.deep.equal({
        errors: [
          {
            data: "ca",
            dataPath: ".where.a",
            instancePath: "/where/a",
            keyword: "type",
            message: "must be number",
            modelName: "PaginationQuery",
            params: {
              type: "number"
            },
            schemaPath: "#/properties/where/properties/a/type"
          }
        ],
        message: 'Bad request on parameter "request.query.q".\nPaginationQuery.where.a must be number. Given value: "ca"',
        name: "AJV_VALIDATION_ERROR",
        status: 400
      });
    });
  });
  describe("Scenario8: String[] value", () => {
    const endpoint = "/rest/query-params/scenario-8";
    it("should return 0 when query is 0", async () => {
      const response = await request.get(`${endpoint}?test=0`).expect(200);

      expect(response.body).to.deep.equal({value: ["0"]});
    });
    it("should return 1 when query is 1", async () => {
      const response = await request.get(`${endpoint}?test=1&test=2`).expect(200);

      expect(response.body).to.deep.equal({value: ["1", "2"]});
    });
  });
}
