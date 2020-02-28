import {ExpressApplication} from "@tsed/common/src";
import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "./helpers/Server";

describe("Multer integration", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  beforeEach(TestContext.bootstrap(Server));
  beforeEach(
    inject([ExpressApplication], (expressApplication: ExpressApplication) => {
      request = SuperTest(expressApplication);
    })
  );
  afterEach(TestContext.reset);

  it("should load a file (with name)", async () => {
    const result = await request
      .post("/rest/archives/with-name")
      .attach("media", `${__dirname}/data/file.txt`);

    expect(result.text).to.eq("file.txt");
  });

  it("should load a file (without name)", async () => {
    const result = await request
      .post("/rest/archives/with-name")
      .attach("media", `${__dirname}/data/file.txt`);

    expect(result.text).to.eq("file.txt");
  });
});
