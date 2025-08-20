import "@tsed/ajv";

import {Controller} from "@tsed/di";
import {PlatformContext} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Context, QueryParams} from "@tsed/platform-params";
import {Default, GenericOf, Generics, Get, Maximum, Minimum, Property} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, beforeAll, describe, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

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

@Controller("/deep-query-params")
class TestDeepQueryParamsCtrl {
  @Get("/scenario-1")
  testScenario1(@QueryParams() @GenericOf(FindQuery) q: PaginationQuery<FindQuery>, @QueryParams() qs: any) {
    return {q};
  }

  @Get("/scenario-2")
  testScenario2(@QueryParams("q") @GenericOf(FindQuery) q: PaginationQuery<FindQuery>) {
    return {q};
  }

  @Get("/scenario-3")
  testScenario3(@Context() $ctx: PlatformContext): any {
    return $ctx.request.query;
  }
}

export function testDeepQueryParams(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      ajv: {
        verbose: false
      },
      mount: {
        "/rest": [TestDeepQueryParamsCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);
  describe("Scenario1: DeepObject", () => {
    const endpoint = "/rest/deep-query-params/scenario-1";
    it("should return 0 when query is 0", async () => {
      const response = await request.get(`${endpoint}?offset=0&limit=10&where[a]=0&where[b]=1`).expect(200);

      expect(response.body).toEqual({
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
  describe("Scenario2: DeepObject", () => {
    const endpoint = "/rest/deep-query-params/scenario-2";
    it("should return the query value", async () => {
      const response = await request.get(`${endpoint}?q[offset]=0&q[limit]=10&q[where][a]=0&q[where][b]=1`).expect(200);

      expect(response.body).toEqual({
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

      expect(response.body).toEqual({
        errors: [
          {
            requestPath: "query",
            data: "ca",
            dataPath: ".where.a",
            instancePath: "/where/a",
            keyword: "type",
            message: "must be number",
            modelName: "PaginationQuery",
            params: {
              type: "number"
            },
            schemaPath: "#/definitions/FindQuery/properties/a/type"
          }
        ],
        message: 'Bad request on parameter "request.query.q".\nPaginationQuery.where.a must be number. Given value: "ca"',
        name: "AJV_VALIDATION_ERROR",
        status: 400
      });
    });
  });
  describe("Scenario3", () => {
    it("should return the query params as object", async () => {
      const endpoint = "/rest/deep-query-params/scenario-3";
      const response = await request.get(`${endpoint}?offset=0&limit=10&where[a]=0&where[b]=1`).expect(200);

      expect(response.body).toEqual({
        offset: "0",
        limit: "10",
        where: {
          a: "0",
          b: "1"
        }
      });
    });
  });
}
