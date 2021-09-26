import {PlatformTest} from "@tsed/common";
import {AlterAudit} from "./AlterAudit";
import {expect} from "chai";
import Sinon from "sinon";

const sandbox = Sinon.createSandbox();

describe("AlterAudit", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(PlatformTest.reset);
  afterEach(() => sandbox.restore());

  it("should log data", async () => {
    const ctx = PlatformTest.createRequestContext();

    sandbox.stub(ctx.logger, "info");

    const alterAudit = await PlatformTest.invoke<AlterAudit>(AlterAudit);

    alterAudit.transform(["data"], "event", ctx);
    expect(ctx.logger.info).to.have.been.calledWithExactly({event: "event", info: ["data"]});
  });
});
