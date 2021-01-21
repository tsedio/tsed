import {PlatformRequest, PlatformResponse, PlatformTest} from "@tsed/common";
import {AlterLog} from "./AlterLog";
import {expect} from "chai";
import Sinon from "sinon";
import {FakeRequest, FakeResponse} from "../../../../test/helper";

const sandbox = Sinon.createSandbox();

describe("AlterLog", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);
  afterEach(() => sandbox.restore());

  it("should log data", async () => {
    const ctx = PlatformTest.createRequestContext({
      request: new PlatformRequest<any>(new FakeRequest()),
      response: new PlatformResponse<any>(new FakeResponse(sandbox))
    });

    sandbox.stub(ctx.logger, "debug");

    const alterLog = await PlatformTest.invoke<AlterLog>(AlterLog);

    alterLog.transform("event", ctx, "data");
    expect(ctx.logger.debug).to.have.been.calledWithExactly({event: "event", info: ["data"]});
    sandbox.restore();
  });
});
