import {PlatformTest} from "@tsed/platform-http/testing";

import {AlterAudit} from "./AlterAudit.js";

describe("AlterAudit", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);

  it("should log data", async () => {
    const ctx = PlatformTest.createRequestContext();

    vi.spyOn(ctx.logger, "info");

    const alterAudit = await PlatformTest.invoke<AlterAudit>(AlterAudit);

    alterAudit.transform(["data"], "event", ctx);
    expect(ctx.logger.info).toHaveBeenCalledWith({event: "event", info: ["data"]});
  });
});
