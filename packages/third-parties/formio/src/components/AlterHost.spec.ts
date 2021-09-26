import {PlatformTest} from "@tsed/common";
import {AlterHost} from "./AlterHost";
import {expect} from "chai";

describe("AlterHost", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);

  it("should transform host", async () => {
    const ctx = PlatformTest.createRequestContext();
    ctx.request.raw.headers["host"] = "host";
    ctx.getRequest().protocol = "https";

    const alterHost = await PlatformTest.invoke<AlterHost>(AlterHost);

    const url = alterHost.transform("/projects", ctx);

    expect(url).to.eq("https://host/projects");
  });
});
