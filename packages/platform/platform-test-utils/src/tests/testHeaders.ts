import {BodyParams, Controller, Get, PlatformTest} from "@tsed/common";
import {Returns} from "@tsed/schema";
import {expect} from "chai";
import SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

@Controller("/headers")
export class HeadersCtrl {
  @Get("/scenario-1")
  @(Returns(200, String).Header("test", "x-token"))
  testScenario1(@BodyParams("test") value: string[]): any {
    return "hello";
  }

  @Get("/scenario-2")
  @(Returns(200, String).Header("x-token-test", "test").Header("x-token-test-2", "test2").ContentType("application/xml"))
  testScenario2() {
    return "<xml></xml>";
  }
}

export function testHeaders(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      logger: {
        level: "off"
      },
      mount: {
        "/rest": [HeadersCtrl]
      }
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  it("Scenario1: GET /rest/headers/scenario-1", async () => {
    const response = await request.get("/rest/headers/scenario-1").expect(200);

    expect(response.text).to.deep.equal("hello");
    expect(response.header["test"]).to.deep.equal("x-token");
  });

  it("Scenario2: GET /rest/headers/scenario-2", (done: Function) => {
    request
      .get("/rest/headers/scenario-2")
      .expect(200)
      .end((err: any, response: any) => {
        if (err) {
          throw err;
        }

        expect(response.headers["x-token-test"]).to.equal("test");
        expect(response.headers["x-token-test-2"]).to.equal("test2");
        expect(response.headers["content-type"]).to.contains("application/xml");

        done();
      });
  });
}
