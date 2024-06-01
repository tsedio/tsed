import {PlatformTest} from "@tsed/common";
import {AlterLog} from "./AlterLog.js";

describe("AlterLog", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);

  it("should log data", async () => {
    const ctx = PlatformTest.createRequestContext();

    jest.spyOn(ctx.logger, "debug");

    const alterLog = await PlatformTest.invoke<AlterLog>(AlterLog);

    alterLog.transform("event", ctx, "data");
    expect(ctx.logger.debug).toHaveBeenCalledWith({event: "event", info: ["data"]});
  });
});
