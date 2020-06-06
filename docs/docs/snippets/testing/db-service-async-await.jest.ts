import {PlatformTest} from "@tsed/common";
import {DbService} from "../services/db";

describe("DbService", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should data from db", async () => {
    const dbService = PlatformTest.get<DbService>(DbService);
    const result = await dbService.getData();
    expect(typeof result).toEqual("object");
  });
});
