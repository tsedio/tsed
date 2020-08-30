import {Controller, Get, MergeParams, PathParams, PlatformTest} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTestUtils} from "@tsed/platform-test-utils";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {rootDir, Server} from "./app/Server";

const utils = PlatformTestUtils.create({
  rootDir,
  platform: PlatformExpress,
  server: Server,
});

@Controller("/merge-params/:parentId")
@MergeParams(true)
class TestMergeParamsCtrl {
  @Get("/:id")
  get(@PathParams("parentId") parentId: string, @PathParams("id") id: string) {
    return {
      parentId,
      id,
    };
  }
}

describe("MergeParams", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    utils.bootstrap({
      mount: {
        "/rest": [TestMergeParamsCtrl],
      },
    })
  );
  after(utils.reset);

  before(() => {
    request = SuperTest(PlatformTest.callback());
  });

  it("should merge params", async () => {
    const {body} = await request.get("/rest/merge-params/parentID/ID").expect(200);

    expect(body).to.deep.eq({
      id: "ID",
      parentId: "parentID",
    });
  });
});
