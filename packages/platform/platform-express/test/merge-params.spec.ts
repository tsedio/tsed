import {Controller, Get, PathParams, PlatformTest} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTestUtils} from "@tsed/platform-test-utils";
import SuperTest from "supertest";
import {rootDir, Server} from "./app/Server";

const utils = PlatformTestUtils.create({
  rootDir,
  platform: PlatformExpress,
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
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(
    utils.bootstrap({
      mount: {
        "/rest": [TestMergeParamsCtrl]
      }
    })
  );
  afterAll(utils.reset);

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
