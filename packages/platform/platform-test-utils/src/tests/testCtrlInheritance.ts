import {Controller, Get, PathParams, PlatformTest, QueryParams} from "@tsed/common";
import {getSpec, SpecTypes} from "@tsed/schema";
import SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

export abstract class TestBaseController {
  @Get("/")
  scenario1(@QueryParams("search") search: string) {
    return {
      search
    };
  }

  @Get("/override")
  scenario3(@QueryParams("q") q: string) {
    return {data: q};
  }
}

@Controller("/test")
export class TestChildController extends TestBaseController {
  @Get("/:id")
  scenario2(@PathParams("id") id: string) {
    return {id};
  }

  @Get("/override")
  scenario3(@QueryParams("s") s: string) {
    return {data: s};
  }
}

export function testCtrlInheritance(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestChildController]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  it("Scenario1: should call inherited method", async () => {
    const {body} = await request.get("/rest/test/?search=test").expect(200);
    expect(body).toEqual({
      search: "test"
    });
  });

  it("Scenario2: should the Child method", async () => {
    const {body} = await request.get("/rest/test/1").expect(200);
    expect(body).toEqual({id: "1"});
  });

  it("Scenario2: should call the Child method and not the base method", async () => {
    const {body} = await request.get("/rest/test/1").expect(200);
    expect(body).toEqual({id: "1"});
  });

  it("should generate swagger json", () => {
    expect(getSpec(TestChildController, {specType: SpecTypes.OPENAPI})).toEqual({
      paths: {
        "/test": {
          get: {
            operationId: "testBaseControllerScenario1",
            parameters: [
              {
                in: "query",
                name: "search",
                required: false,
                schema: {
                  type: "string"
                }
              }
            ],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["TestChildController"]
          }
        },
        "/test/override": {
          get: {
            operationId: "testChildControllerScenario3",
            parameters: [
              {
                in: "query",
                name: "s",
                required: false,
                schema: {
                  type: "string"
                }
              }
            ],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["TestChildController"]
          }
        },
        "/test/{id}": {
          get: {
            operationId: "testChildControllerScenario2",
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                schema: {
                  type: "string"
                }
              }
            ],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["TestChildController"]
          }
        }
      },
      tags: [
        {
          name: "TestChildController"
        }
      ]
    });
  });
}
