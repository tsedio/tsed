import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import {DbService} from "../services/db";

describe("DbService", () => {
  let result: any;
  before(TestContext.create);
  after(TestContext.reset);

  it("should data from db", inject([DbService], async (dbService: DbService) => {
    result = await dbService.getData();
    expect(result).to.be.an("object");
  }));
});
