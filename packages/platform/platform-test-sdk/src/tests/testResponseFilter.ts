import {Controller} from "@tsed/di";
import {PlatformContext} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {ResponseFilter} from "@tsed/platform-response-filter";
import {Get, Property, Returns} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, beforeAll, describe, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

class ResponseFilterModel {
  @Property()
  id: string;
}

@Controller("/response-filter")
class TestResponseFilterCtrl {
  @Get("/scenario1/:id")
  @(Returns(200, ResponseFilterModel).Description("description"))
  @(Returns(200, String).ContentType("text/xml"))
  public testScenario1() {
    return {id: "id"};
  }
}

@ResponseFilter("text/xml")
class XmlResponseFilter {
  transform(data: unknown, ctx: PlatformContext) {
    return "<xml>test</xml>";
  }
}

@ResponseFilter("*/*")
class AnyResponseFilter {
  transform(data: unknown, ctx: PlatformContext) {
    return {data, errors: []};
  }
}

export function testResponseFilter(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestResponseFilterCtrl]
      },
      responseFilters: [XmlResponseFilter, AnyResponseFilter] as never[]
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe("Scenario1: when have multiple contentType", () => {
    describe("GET /rest/response/scenario1/:id", () => {
      it("should return the xml format", async () => {
        const response = await request
          .get("/rest/response-filter/scenario1/10")
          .set({
            Accept: "text/xml"
          })
          .expect(200);

        expect(response.text).toEqual("<xml>test</xml>");
      });
      it("should return the xml format when Accept text/xml and application/json", async () => {
        const response = await request
          .get("/rest/response-filter/scenario1/10")
          .set({
            Accept: "text/xml, application/json"
          })
          .expect(200);

        expect(response.text).toEqual("<xml>test</xml>");
      });
      it("should return the json format", async () => {
        const response = await request
          .get("/rest/response-filter/scenario1/10")
          .set({
            Accept: "application/json"
          })
          .expect(200);

        expect(response.body).toEqual({
          data: {
            id: "id"
          },
          errors: []
        });
      });
      it("should return the json format by default", async () => {
        const response = await request.get("/rest/response-filter/scenario1/10").expect(200);

        expect(response.body).toEqual({
          data: {
            id: "id"
          },
          errors: []
        });
      });
    });
  });
}
