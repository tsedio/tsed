import {Controller} from "@tsed/di";
import {Res} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Context} from "@tsed/platform-params";
import {ResponseFilter} from "@tsed/platform-response-filter";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {Get, Returns} from "@tsed/schema";
import {ServerResponse} from "http";
import SuperTest from "supertest";

import {PlatformExpress} from "../src/index.js";
import {rootDir, Server} from "./app/Server.js";

@ResponseFilter("plain/text")
class PlainTextFilter {
  transform(data: any, ctx: Context) {
    // `ctx.response.raw.headers` is always has `content-type` as `text/plain; charset=utf-8`
    return data;
  }
}

const utils = PlatformTestSdk.create({
  rootDir,
  platform: PlatformExpress,
  server: Server,
  logger: {
    level: "off"
  }
});

@Controller("/response-filter")
class TestPageableCtrl {
  @Get("/scenario-1")
  @(Returns(200).ContentType("image/png"))
  scenario1() {
    const raw = "...";
    // response.setHeader('Content-Type', 'image/png');

    return Promise.resolve(Buffer.from(raw, "base64"));
  }

  @Get("/scenario-2")
  scenario2(@Res() response: ServerResponse) {
    const raw = "...";
    response.setHeader("Content-Type", "image/png");

    return Promise.resolve(Buffer.from(raw, "base64"));
  }
}

describe("ResponseFilter", () => {
  let request: SuperTest.Agent;

  beforeEach(
    utils.bootstrap({
      mount: {
        "/rest": [TestPageableCtrl]
      },
      responseFilters: [PlainTextFilter]
    })
  );
  beforeEach(() => {
    vi.spyOn(PlainTextFilter.prototype, "transform").mockReturnValue(undefined);
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(() => utils.reset());
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should return png (scenario-1)", async () => {
    const {headers} = await request.get("/rest/response-filter/scenario-1").expect(200);

    expect(headers["content-type"]).toEqual("image/png");
    expect(PlainTextFilter.prototype.transform).not.toHaveBeenCalled();
  });

  it("should return png (scenario-2)", async () => {
    const {headers} = await request.get("/rest/response-filter/scenario-2").expect(200);

    expect(headers["content-type"]).toEqual("image/png");
    expect(PlainTextFilter.prototype.transform).not.toHaveBeenCalled();
  });
});
