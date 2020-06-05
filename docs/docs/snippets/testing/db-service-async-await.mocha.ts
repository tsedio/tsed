import {PlatformTest} from "@tsed/common/src";
import {expect} from "chai";
import {DbService} from "../services/db";

describe("DbService", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should data from db", PlatformTest.inject([DbService], async (dbService: DbService) => {
    const result = await dbService.getData();
    expect(result).to.be.an("object");
  }));
});
