import {Server, rootDir} from "./app/Server.js";
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import {PathParams} from "@tsed/platform-params";
import {PlatformExpress} from "../src/index.js";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import SuperTest from "supertest";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformExpress as any,
  server: Server
});

@Controller("/merge-params/:parentId")
class TestMergeParamsCtrl {
  @Get("/:id")
  get(@PathParams("parentId") parentId: string, @PathParams("id") id: string) {
    return {
      parentId,
      id
    };
  }
}

describe("MergeParams", () => {
  let request: SuperTest.Agent;

  beforeAll(
    utils.bootstrap({
      mount: {
        "/rest": [TestMergeParamsCtrl]
      }
    })
  );
  afterAll(() => utils.reset());

  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });

  it("should merge params", async () => {
    const {body} = await request.get("/rest/merge-params/parentID/ID").expect(200);

    expect(body).toEqual({
      id: "ID",
      parentId: "parentID"
    });
  });
});
