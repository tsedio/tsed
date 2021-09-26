import {PlatformTest} from "@tsed/common";
import {AlterSkip} from "./AlterSkip";
import {expect} from "chai";
import Sinon from "sinon";

const sandbox = Sinon.createSandbox();

describe("AlterSkip", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);

  it("should transform skip", async () => {
    const ctx = PlatformTest.createRequestContext();

    const alterSkip = await PlatformTest.invoke<AlterSkip>(AlterSkip);

    ctx.getRequest().originalUrl = "/spec.json";

    const result = alterSkip.transform(false, ctx);

    expect(result).to.eq(true);
  });

  it("should transform skip and return false", async () => {
    const ctx = PlatformTest.createRequestContext();

    const alterSkip = await PlatformTest.invoke<AlterSkip>(AlterSkip);

    ctx.getRequest().originalUrl = "/other";

    const result = alterSkip.transform(false, ctx);

    expect(result).to.eq(false);
  });

  it("should not transform skip", async () => {
    const ctx = PlatformTest.createRequestContext();

    const alterSkip = await PlatformTest.invoke<AlterSkip>(AlterSkip);

    ctx.getRequest().originalUrl = "/other";

    const result = alterSkip.transform(true, ctx);

    expect(result).to.eq(true);
  });
});
