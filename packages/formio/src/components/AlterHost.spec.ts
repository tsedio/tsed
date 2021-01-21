import {PlatformRequest, PlatformResponse, PlatformTest} from "@tsed/common";
import {AlterHost} from "./AlterHost";
import {expect} from "chai";
import Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../test/helper";

const sandbox = Sinon.createSandbox();

describe("AlterHost", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);

  it("should transform host", async () => {
    const ctx = PlatformTest.createRequestContext({
      request: new PlatformRequest<any>(new FakeRequest()),
      response: new PlatformResponse<any>(new FakeResponse(sandbox))
    });

    ctx.getRequest().protocol = "https";

    const alterHost = await PlatformTest.invoke<AlterHost>(AlterHost);

    const url = alterHost.transform("/projects", ctx);

    expect(url).to.eq("https://headerValue/projects");
  });
});
