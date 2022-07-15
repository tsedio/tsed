import {PlatformTest} from "@tsed/common";
import {AlterAudit} from "./AlterAudit";

describe("AlterAudit", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);

  it("should log data", async () => {
    const ctx = PlatformTest.createRequestContext();

    jest.spyOn(ctx.logger, "info");

    const alterAudit = await PlatformTest.invoke<AlterAudit>(AlterAudit);

    alterAudit.transform(["data"], "event", ctx);
    expect(ctx.logger.info).toHaveBeenCalledWith({event: "event", info: ["data"]});
  });
});
