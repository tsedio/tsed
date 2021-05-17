import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import fs from "fs-extra";
import {OidcJwks} from "./OidcJwks";

const sandbox = Sinon.createSandbox();
describe("OidcJwks", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should create files", async () => {
    const oidcJwks = await PlatformTest.invoke<OidcJwks>(OidcJwks);

    sandbox.stub(fs, "ensureDirSync");
    sandbox.stub(fs, "existsSync").returns(false);
    sandbox.stub(fs, "readFileSync").returns("{}");
    sandbox.stub(fs, "writeFileSync");

    await oidcJwks.getJwks();

    expect(fs.writeFileSync).to.have.been.called;
    sandbox.restore();
  });
});
