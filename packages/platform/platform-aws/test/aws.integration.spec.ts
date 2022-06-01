import {PlatformTest} from "@tsed/common";
import "@tsed/platform-express";
import {PlatformExpress} from "@tsed/platform-express";
import SuperTest from "supertest";
import {Server} from "./app/Server";

describe("Aws", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(
    PlatformTest.bootstrap(Server, {
      platform: PlatformExpress
    })
  );
  beforeAll(() => (request = SuperTest(PlatformTest.callback())));
  afterAll(PlatformTest.reset);

  it("should return aws headers", async () => {
    const response = await request
      .get("/aws")
      .set({
        "x-apigateway-event": encodeURIComponent(JSON.stringify({event: "event"})),
        "x-apigateway-context": encodeURIComponent(JSON.stringify({context: "context"}))
      })
      .expect(200);

    expect(response.body).toEqual({
      context: {
        context: "context"
      },
      event: {
        event: "event"
      }
    });
  });
});
