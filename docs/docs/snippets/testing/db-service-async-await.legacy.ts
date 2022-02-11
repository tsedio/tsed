import {TestContext} from "@tsed/testing";
import {expect} from "chai";
import {DbService} from "../services/db";

describe("DbService", () => {
  beforeEach(TestContext.create);
  afterEach(TestContext.reset);

  it(
    "should data from db",
    TestContext.inject([DbService], async (dbService: DbService) => {
      const result = await dbService.getData();
      expect(result).to.be.an("object");
    })
  );
});
