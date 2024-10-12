import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Get, Put} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, afterEach, beforeAll, expect, it, vi} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

const stub = vi.fn();

@Controller("/routing")
export class TestRoutingController {
  @Get("/1")
  scenario1() {
    stub("scenario1");

    return "test1";
  }

  @Put("") // empty string has an effect on the calls orders
  scenario2() {
    stub("scenario2");

    return "shouldNotRun";
  }

  @Get("/3")
  scenario3() {
    stub("scenario3");

    return "test3";
  }
}

export function testRouting(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [TestRoutingController]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Scenario1: should call scenario1 only", async () => {
    const {text} = await request.get("/rest/routing/1").expect(200);
    expect(text).toEqual("test1");
    expect(stub).toHaveBeenCalledWith("scenario1");
  });

  it("Scenario2: should call scenario2 only", async () => {
    const {text} = await request.put("/rest/routing/").expect(200);
    expect(text).toEqual("shouldNotRun");
    expect(stub).toHaveBeenCalledWith("scenario2");
  });

  it("Scenario3: should call scenario3 only", async () => {
    const {text} = await request.get("/rest/routing/3").expect(200);
    expect(text).toEqual("test3");
    expect(stub).toHaveBeenCalledWith("scenario3");
  });
}
