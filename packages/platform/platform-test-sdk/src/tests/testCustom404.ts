import {expect, beforeAll, afterAll, it} from "vitest";
import {PlatformTest} from "@tsed/common";
import SuperTest from "supertest";
import {PlatformTestingSdkOpts} from "../interfaces/index.js";

export function testCustom404(options: PlatformTestingSdkOpts) {
  class CustomServer extends options.server {}

  let request: SuperTest.Agent;
  beforeAll(
    PlatformTest.bootstrap(CustomServer, {
      ...options,
      mount: {
        "/rest": []
      }
    })
  );

  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  it("Scenario 1: GET /", async () => {
    const response: any = await request.get("/").expect(404);

    expect(response.body).toEqual({
      name: "NOT_FOUND",
      message: 'Resource "/" not found',
      status: 404,
      errors: []
    });
  });
}
