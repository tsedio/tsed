import {Configuration, Controller} from "@tsed/di";
import {afterEach, beforeEach, expect, it} from "vitest";
import {PlatformRouter} from "@tsed/platform-router";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestingSdkOpts} from "../interfaces/index.js";
import SuperTest from "supertest";
import {getValue} from "@tsed/core";
import {readFileSync} from "node:fs";

@Controller("/statics")
class CustomStaticsCtrl {
  constructor(router: PlatformRouter, @Configuration() config: Configuration) {
    router.statics("/", {
      root: String(getValue(config, "statics./"))
    });
  }
}

export function testStatics(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;
  beforeEach(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [CustomStaticsCtrl]
      }
    })
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterEach(PlatformTest.reset);

  it("should return index HTML (1)", async () => {
    const response = await request.get("/").expect(200);

    expect(response.text).toEqual(readFileSync(`${options.rootDir}/public/index.html`, {encoding: "utf8"}));
  });

  it("should return index HTML (2)", async () => {
    const response = await request.get("/index.html").expect(200);

    expect(response.text).toEqual(readFileSync(`${options.rootDir}/public/index.html`, {encoding: "utf8"}));
  });

  it("should return index HTML (3)", async () => {
    const response = await request.get("/rest/statics/index.html").expect(200);

    expect(response.text).toEqual(readFileSync(`${options.rootDir}/public/index.html`, {encoding: "utf8"}));
  });

  it("should return 404", async () => {
    const response = await request.get("/index-te.html").expect(404);

    expect(response.body).toEqual({
      errors: [],
      message: 'Resource "/index-te.html" not found',
      name: "NOT_FOUND",
      status: 404
    });
  });
}
