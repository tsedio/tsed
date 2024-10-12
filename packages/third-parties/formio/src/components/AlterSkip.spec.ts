import {PlatformTest} from "@tsed/platform-http/testing";

import {AlterSkip} from "./AlterSkip.js";

describe("AlterSkip", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);

  it("should transform skip", async () => {
    const ctx = PlatformTest.createRequestContext();

    const alterSkip = await PlatformTest.invoke<AlterSkip>(AlterSkip);

    ctx.getRequest().originalUrl = "/spec.json";

    const result = alterSkip.transform(false, ctx);

    expect(result).toEqual(true);
  });

  it("should transform skip and return false", async () => {
    const ctx = PlatformTest.createRequestContext();

    const alterSkip = await PlatformTest.invoke<AlterSkip>(AlterSkip);

    ctx.getRequest().originalUrl = "/other";

    const result = alterSkip.transform(false, ctx);

    expect(result).toEqual(false);
  });

  it("should not transform skip", async () => {
    const ctx = PlatformTest.createRequestContext();

    const alterSkip = await PlatformTest.invoke<AlterSkip>(AlterSkip);

    ctx.getRequest().originalUrl = "/other";

    const result = alterSkip.transform(true, ctx);

    expect(result).toEqual(true);
  });
});
